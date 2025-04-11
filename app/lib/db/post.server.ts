import { asc, desc, eq, gt, inArray, like, lt, SQL } from 'drizzle-orm'

import { db, type TransactionType } from '~/lib/db/db.server'
import type { Category, Post, Seo, Tag, user } from '~/lib/db/schema'
import {
	categoriesTable,
	postsTable,
	PostStatus,
	postsToCategories,
	postsToTags,
	seosTable,
	tagsTable,
} from '~/lib/db/schema'

type User = typeof user.$inferSelect

export type PostWithRelations = Post & {
	seo: Seo
	tags: Tag[]
	categories: Category[]
	author: User | null
}

export const getPosts = async (
	props: {
		cursor?: number
		pageSize?: number
		direction?: 'next' | 'previous'
		status?: PostStatus | 'ALL'
		categoriesFilter?: string[]
		tagsFilter?: string[]
		titleQuery?: string
	} = {},
): Promise<{
	posts: PostWithRelations[]
	nextCursor: number | null
	prevCursor: number | null
	totalCount: number
	categoriesFilter?: Category[]
	tagsFilter?: Tag[]
	hasMore: boolean
}> => {
	const {
		cursor,
		pageSize = 10,
		direction = 'next',
		status = 'PUBLISHED', // Default status is PUBLISHED
		categoriesFilter,
		tagsFilter,
		titleQuery = '',
	} = props

	let filteredPostIds: number[] | undefined = undefined
	let categories: Category[] | undefined = undefined
	let tags: Tag[] | undefined = undefined

	if (categoriesFilter && categoriesFilter.length > 0) {
		const { categoriessWithPostIds, postIds } =
			await getPostIdsByCategorySlugs(categoriesFilter)
		categories = categoriessWithPostIds
		filteredPostIds = [...postIds]
	}
	if (tagsFilter && tagsFilter.length > 0) {
		const { tagsWithPostIds, postIds } = await getPostIdsByTagSlugs(tagsFilter)
		tags = tagsWithPostIds
		if (filteredPostIds) {
			filteredPostIds = filteredPostIds.filter(id => postIds.includes(id)) // Inner join
		} else {
			filteredPostIds = [...postIds]
		}
	}

	const statusCondition =
		status !== 'ALL' ? [eq(postsTable.status, status)] : []

	const baseConditions = [
		...statusCondition,
		...(titleQuery ? [like(postsTable.title, `%${titleQuery}%`)] : []),
	]

	let cursorCondition: SQL[] = []
	if (cursor !== undefined) {
		if (direction === 'next') {
			cursorCondition = [lt(postsTable.id, cursor)]
		} else {
			cursorCondition = [gt(postsTable.id, cursor)]
		}
	}

	const postsRaw = await db.query.postsTable.findMany({
		where: (posts, { and }) =>
			and(
				...baseConditions,
				...cursorCondition,
				...(filteredPostIds ? [inArray(posts.id, filteredPostIds)] : []),
			),
		with: {
			author: true,
			seo: true,
			postsToTags: {
				with: {
					tag: true,
				},
			},
			postsToCategories: {
				with: {
					category: true,
				},
			},
		},
		orderBy:
			direction === 'next'
				? (posts, { asc }) => asc(posts.id)
				: (posts, { desc }) => desc(posts.id),
		limit: pageSize + 1,
	})

	const posts = postsRaw.map(post => {
		return {
			...post,
			tags: post.postsToTags.map(association => association.tag),
			categories: post.postsToCategories.map(
				association => association.category,
			),
		}
	})

	const hasMore = posts.length > pageSize

	const pagePosts = hasMore ? posts.slice(0, pageSize) : posts

	const resultPosts = direction === 'previous' ? pagePosts.reverse() : pagePosts

	// Calculate next and previous cursors
	const nextCursor =
		resultPosts.length > 0 ? resultPosts[resultPosts.length - 1].id : null
	const prevCursor = resultPosts.length > 0 ? resultPosts[0].id : null

	return {
		posts,
		nextCursor: hasMore ? nextCursor : null,
		prevCursor: cursor ? prevCursor : null,
		totalCount: posts.length,
		categoriesFilter: categories,
		tagsFilter: tags,
		hasMore,
	}
}

export const getPostIdsByTagSlugs = async (
	tagSlugs: string[],
): Promise<{ tagsWithPostIds: typeof tagsWithPostIds; postIds: number[] }> => {
	const tagsWithPostIds = await db.query.tagsTable.findMany({
		where: (tags, { inArray }) => inArray(tags.slug, tagSlugs),
		with: {
			postsToTags: {
				columns: {
					postId: true,
				},
			},
		},
	})
	const filteredPostIds = tagsWithPostIds.flatMap(t =>
		t.postsToTags.flatMap(t => t.postId),
	)
	return { tagsWithPostIds, postIds: filteredPostIds }
}

export const getPostIdsByCategorySlugs = async (
	categorySlugs: string[],
): Promise<{
	categoriessWithPostIds: typeof catsWithPostIds
	postIds: number[]
}> => {
	const catsWithPostIds = await db.query.categoriesTable.findMany({
		where: (cats, { inArray }) => inArray(cats.slug, categorySlugs),
		with: {
			postsToCategories: {
				columns: {
					postId: true,
				},
			},
		},
	})
	const filteredPostIds = catsWithPostIds.flatMap(t =>
		t.postsToCategories.flatMap(t => t.postId),
	)
	return { categoriessWithPostIds: catsWithPostIds, postIds: filteredPostIds }
}

export const getPostsByAuthor = async (
	authorId: string,
): Promise<{ posts: typeof posts }> => {
	const posts = await db.query.postsTable.findMany({
		where: (post, { eq }) => eq(post.authorId, authorId),
		with: {
			postsToTags: {
				columns: {
					postId: true,
				},
			},
		},
	})

	return { posts }
}

export const getPost = async (
	id: number,
): Promise<{ post: PostWithRelations | null }> => {
	const postRaw = await db.query.postsTable.findFirst({
		where: (t, { eq }) => eq(t.id, id),
		with: {
			author: true,
			seo: true,
			postsToTags: {
				with: {
					tag: true,
				},
			},
			postsToCategories: {
				with: {
					category: true,
				},
			},
		},
	})

	const post = postRaw
		? {
				...postRaw,
				tags: postRaw.postsToTags.map(association => association.tag),
				categories: postRaw.postsToCategories.map(
					association => association.category,
				),
			}
		: null

	return { post }
}

export const getPostBySlug = async (
	slug: string,
	status: PostStatus = 'PUBLISHED',
): Promise<{
	post: PostWithRelations | null
	prevPost: PostWithRelations | null
	nextPost: PostWithRelations | null
}> => {
	const postRaw = await db.query.postsTable.findFirst({
		where: (posts, { eq, and }) =>
			and(eq(posts.slug, slug), eq(posts.status, status)),
		with: {
			seo: true,
			author: true,
			postsToTags: {
				with: {
					tag: true,
				},
			},
			postsToCategories: {
				with: {
					category: true,
				},
			},
		},
	})

	if (!postRaw) {
		return { post: null, prevPost: null, nextPost: null }
	}

	const post = {
		...postRaw,
		tags: postRaw.postsToTags.map(association => association.tag),
		categories: postRaw.postsToCategories.map(
			association => association.category,
		),
	}

	const prevPostRaw = await db.query.postsTable.findFirst({
		where: (posts, { lt, eq, and }) =>
			and(lt(posts.id, postRaw.id), eq(posts.status, status)),
		orderBy: desc(postsTable.id),
		with: {
			seo: true,
			author: true,
			postsToTags: {
				with: {
					tag: true,
				},
			},
			postsToCategories: {
				with: {
					category: true,
				},
			},
		},
	})

	const nextPostRaw = await db.query.postsTable.findFirst({
		where: (posts, { gt, eq, and }) =>
			and(gt(posts.id, postRaw.id), eq(posts.status, status)),
		orderBy: asc(postsTable.id),
		with: {
			seo: true,
			author: true,
			postsToTags: {
				with: {
					tag: true,
				},
			},
			postsToCategories: {
				with: {
					category: true,
				},
			},
		},
	})

	const prevPost = prevPostRaw
		? {
				...prevPostRaw,
				tags: prevPostRaw.postsToTags.map(association => association.tag),
				categories: prevPostRaw.postsToCategories.map(
					association => association.category,
				),
			}
		: null

	const nextPost = nextPostRaw
		? {
				...nextPostRaw,
				tags: nextPostRaw.postsToTags.map(association => association.tag),
				categories: nextPostRaw.postsToCategories.map(
					association => association.category,
				),
			}
		: null

	return {
		post,
		prevPost,
		nextPost,
	}
}

type CreatePostProps = Omit<
	typeof postsTable.$inferInsert,
	'id' | 'createdAt' | 'updatedAt'
> & {
	tags: (typeof tagsTable.$inferSelect)[]
	categories: (typeof categoriesTable.$inferSelect)[]
} & {
	seo: Pick<Seo, 'metaDescription' | 'metaTitle'>
}

export const createPost = async (
	props: CreatePostProps,
): Promise<{ post: PostWithRelations }> => {
	const {
		authorId,
		title,
		content,
		slug,
		excerpt,
		status,
		featuredImage,
		tags,
		categories,
		seo,
	} = props

	const post = await db.transaction(async tx => {
		const [postCreated] = await tx
			.insert(postsTable)
			.values({
				authorId: authorId,
				title: title,
				content: content,
				slug: slug,
				excerpt: excerpt,
				status: status,
				featuredImage: featuredImage,
			})
			.returning()

		const author = authorId
			? ((await tx.query.user.findFirst({
					where: (users, { eq }) => eq(users.id, authorId),
				})) ?? null)
			: null

		const [seoCreated] = await tx
			.insert(seosTable)
			.values({
				metaTitle: seo.metaTitle || title,
				metaDescription: seo.metaDescription || excerpt || '',
				autoGenerated: true,
				postId: postCreated.id,
				route: '/blog/' + slug,
			})
			.returning()

		const tagsRelated = await processTaxonomyTags(tx, tags, postCreated.id)
		const categoriesRelated = await processTaxonomyCategories(
			tx,
			categories,
			postCreated.id,
		)

		return {
			...postCreated,
			author,
			seo: seoCreated,
			tags: tagsRelated,
			categories: categoriesRelated,
		}
	})

	return { post }
}

interface UpdatePostProps extends CreatePostProps {
	id: number
}

export const updatePost = async (
	props: UpdatePostProps,
): Promise<{ post: PostWithRelations }> => {
	const {
		id,
		authorId,
		title,
		content,
		slug,
		excerpt,
		status,
		featuredImage,
		tags,
		categories,
		seo,
	} = props

	const post = await db.transaction(async tx => {
		const [postUpdated] = await tx
			.update(postsTable)
			.set({
				authorId: authorId,
				title: title,
				content: content,
				slug: slug,
				excerpt: excerpt,
				status: status,
				featuredImage: featuredImage,
			})
			.where(eq(postsTable.id, id))
			.returning()

		const author = authorId
			? ((await tx.query.user.findFirst({
					where: (users, { eq }) => eq(users.id, authorId),
				})) ?? null)
			: null

		const [seoUpdated] = await tx
			.update(seosTable)
			.set({
				metaTitle: seo.metaTitle || title,
				metaDescription: seo.metaDescription || '',
				route: '/blog/' + slug,
			})
			.where(eq(seosTable.postId, id))
			.returning()

		const tagsRelated = await processTaxonomyTags(tx, tags, id)
		const categoriesRelated = await processTaxonomyCategories(
			tx,
			categories,
			id,
		)

		return {
			...postUpdated,
			author,
			seo: seoUpdated,
			tags: tagsRelated,
			categories: categoriesRelated,
		}
	})

	return { post }
}

export const deletePost = async (id: number): Promise<{ post: Post }> => {
	const [post] = await db
		.delete(postsTable)
		.where(eq(postsTable.id, id))
		.returning()
	return { post }
}

export const processTaxonomyTags = async (
	tx: TransactionType,
	tags: Tag[],
	postId: number,
): Promise<Tag[]> => {
	// New tags are negative IDs
	const existingTags = tags.filter(tag => tag.id > 0)
	const newTags = tags.filter(tag => tag.id < 0)

	// Check if names are unique
	const newTagNames = newTags.map(tag => tag.name)
	const existingNewTags = await tx
		.select()
		.from(tagsTable)
		.where(inArray(tagsTable.name, newTagNames))

	// Filter tags that with name already exist
	const tagsToInsert = newTags.filter(
		newTag => !existingNewTags.some(tag => tag.name === newTag.name),
	)

	// Insert new tags
	let insertedTags: Tag[] = []
	if (tagsToInsert.length > 0) {
		insertedTags = await tx
			.insert(tagsTable)
			.values(
				tagsToInsert.map(tag => ({
					name: tag.name,
					slug: tag.slug,
					description: tag.description,
				})),
			)
			.returning()
	}

	// Combine existing new tags and newly created tags
	const createdTagIds = [
		...existingNewTags.map(tag => tag.id),
		...insertedTags.map(tag => tag.id),
	]

	const allTagIds = [...existingTags.map(tag => tag.id), ...createdTagIds]

	// Clear existing relations
	await tx.delete(postsToTags).where(eq(postsToTags.postId, postId))

	// Create new relations
	if (allTagIds.length > 0) {
		await tx.insert(postsToTags).values(
			allTagIds.map(tagId => ({
				postId: postId,
				tagId: tagId,
			})),
		)

		return await tx
			.select()
			.from(tagsTable)
			.where(inArray(tagsTable.id, allTagIds))
	}

	return []
}

export const processTaxonomyCategories = async (
	tx: TransactionType,
	categories: Category[],
	postId: number,
): Promise<Category[]> => {
	// New categories are negative IDs
	const existingCats = categories.filter(cat => cat.id > 0)
	const newCategories = categories.filter(cat => cat.id < 0)

	// Check if names are unique
	const newCatNames = newCategories.map(cat => cat.name)
	const existingNewCats = await tx
		.select()
		.from(categoriesTable)
		.where(inArray(categoriesTable.name, newCatNames))

	// Filter cats that with name already exist
	const catsToInsert = newCategories.filter(
		newCat => !existingNewCats.some(cat => cat.name === newCat.name),
	)

	// Insert new cats
	let insertedCats: Category[] = []
	if (catsToInsert.length > 0) {
		insertedCats = await tx
			.insert(categoriesTable)
			.values(
				catsToInsert.map(cat => ({
					name: cat.name,
					slug: cat.slug,
					description: cat.description,
				})),
			)
			.returning()
	}

	// Combine existing new cats and newly created cats
	const createdCatIds = [
		...existingNewCats.map(cat => cat.id),
		...insertedCats.map(cat => cat.id),
	]

	const allCatIds = [...existingCats.map(cat => cat.id), ...createdCatIds]

	await tx.delete(postsToCategories).where(eq(postsToCategories.postId, postId))

	if (allCatIds.length > 0) {
		await tx.insert(postsToCategories).values(
			allCatIds.map(categoryId => ({
				postId: postId,
				categoryId: categoryId,
			})),
		)

		return await tx
			.select()
			.from(categoriesTable)
			.where(inArray(categoriesTable.id, allCatIds))
	}

	return []
}
