import { and, asc, desc, eq, gt, inArray, like, lt, SQL } from 'drizzle-orm'

import { db, type TransactionType } from '~/lib/db/db.server'
import type { Category, Post, Seo, Tag, user } from '~/lib/db/schema'
import {
	category as categoryTable,
	PostStatus,
	post as postTable,
	postToCategory,
	postToTag,
	seo as seoTable,
	tag as tagTable,
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
		status?: PostStatus | 'ALL'
		categorySlugs?: string[]
		tagSlugs?: string[]
		title?: string
	} = {},
): Promise<{
	posts: PostWithRelations[]
	categoriesFilter?: Category[]
	tagsFilter?: Tag[]
}> => {
	const { status = 'PUBLISHED', categorySlugs, tagSlugs, title } = props

	// Build where conditions array
	const whereConditions: SQL[] = []

	// Status filter
	if (status !== 'ALL') {
		whereConditions.push(eq(postTable.status, status))
	}

	// Title filter
	if (title) {
		whereConditions.push(like(postTable.title, `%${title}%`))
	}

	let filteredPostIds: number[] | undefined = undefined
	let categories: Category[] | undefined = undefined
	let tags: Tag[] | undefined = undefined

	// Get post IDs filtered by categories
	if (categorySlugs && categorySlugs.length > 0) {
		const { categoriessWithPostIds, postIds } =
			await getPostIdsByCategorySlugs(categorySlugs)
		categories = categoriessWithPostIds
		filteredPostIds = [...postIds]
	}

	// Get post IDs filtered by tags (intersect with category filter if exists)
	if (tagSlugs && tagSlugs.length > 0) {
		const { tagsWithPostIds, postIds } = await getPostIdsByTagSlugs(tagSlugs)
		tags = tagsWithPostIds
		if (filteredPostIds) {
			// Intersection: posts must have both category and tag filters
			filteredPostIds = filteredPostIds.filter(id => postIds.includes(id))
		} else {
			filteredPostIds = [...postIds]
		}
	}

	// Add post ID filter if we have filtered IDs
	if (filteredPostIds && filteredPostIds.length > 0) {
		whereConditions.push(inArray(postTable.id, filteredPostIds))
	} else if (filteredPostIds && filteredPostIds.length === 0) {
		// No posts match the filters, return empty result early
		return {
			posts: [],
			categoriesFilter: categories,
			tagsFilter: tags,
		}
	}

	// Combine all where conditions
	const whereClause =
		whereConditions.length > 0
			? whereConditions.length === 1
				? whereConditions[0]
				: and(...whereConditions)
			: undefined

	const postsRaw = await db.query.post.findMany({
		where: whereClause,
		orderBy: desc(postTable.createdAt),
		with: {
			author: true,
			seo: true,
			postToTag: {
				with: {
					tag: true,
				},
			},
			postToCategory: {
				with: {
					category: true,
				},
			},
		},
	})

	const posts = postsRaw.map(post => {
		return {
			...post,
			tags: post.postToTag.map(association => association.tag),
			categories: post.postToCategory.map(association => association.category),
		}
	})

	return {
		posts,
		categoriesFilter: categories,
		tagsFilter: tags,
	}
}

export const getPostIdsByTagSlugs = async (
	tagSlugs: string[],
): Promise<{ tagsWithPostIds: typeof tagsWithPostIds; postIds: number[] }> => {
	const tagsWithPostIds = await db.query.tag.findMany({
		where: (tags, { inArray }) => inArray(tags.slug, tagSlugs),
		with: {
			postToTag: {
				columns: {
					postId: true,
				},
			},
		},
	})
	const filteredPostIds = tagsWithPostIds.flatMap(t =>
		t.postToTag.flatMap(t => t.postId),
	)
	return { tagsWithPostIds, postIds: filteredPostIds }
}

export const getPostIdsByCategorySlugs = async (
	categorySlugs: string[],
): Promise<{
	categoriessWithPostIds: typeof catsWithPostIds
	postIds: number[]
}> => {
	const catsWithPostIds = await db.query.category.findMany({
		where: (cats, { inArray }) => inArray(cats.slug, categorySlugs),
		with: {
			postToCategory: {
				columns: {
					postId: true,
				},
			},
		},
	})
	const filteredPostIds = catsWithPostIds.flatMap(t =>
		t.postToCategory.flatMap(t => t.postId),
	)
	return { categoriessWithPostIds: catsWithPostIds, postIds: filteredPostIds }
}

export const getPostsByAuthor = async (
	authorId: string,
): Promise<{ posts: typeof posts }> => {
	const posts = await db.query.post.findMany({
		where: (post, { eq }) => eq(post.authorId, authorId),
		with: {
			postToTag: {
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
	const postRaw = await db.query.post.findFirst({
		where: (t, { eq }) => eq(t.id, id),
		with: {
			author: true,
			seo: true,
			postToTag: {
				with: {
					tag: true,
				},
			},
			postToCategory: {
				with: {
					category: true,
				},
			},
		},
	})

	const post = postRaw
		? {
				...postRaw,
				tags: postRaw.postToTag.map(association => association.tag),
				categories: postRaw.postToCategory.map(
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
	const postRaw = await db.query.post.findFirst({
		where: (posts, { eq, and }) =>
			and(eq(posts.slug, slug), eq(posts.status, status)),
		with: {
			seo: true,
			author: true,
			postToTag: {
				with: {
					tag: true,
				},
			},
			postToCategory: {
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
		tags: postRaw.postToTag.map(association => association.tag),
		categories: postRaw.postToCategory.map(association => association.category),
	}

	const prevPostRaw = await db.query.post.findFirst({
		where: (posts, { lt, eq, and }) =>
			and(lt(posts.id, postRaw.id), eq(posts.status, status)),
		orderBy: desc(postTable.id),
		with: {
			seo: true,
			author: true,
			postToTag: {
				with: {
					tag: true,
				},
			},
			postToCategory: {
				with: {
					category: true,
				},
			},
		},
	})

	const nextPostRaw = await db.query.post.findFirst({
		where: (posts, { gt, eq, and }) =>
			and(gt(posts.id, postRaw.id), eq(posts.status, status)),
		orderBy: asc(postTable.id),
		with: {
			seo: true,
			author: true,
			postToTag: {
				with: {
					tag: true,
				},
			},
			postToCategory: {
				with: {
					category: true,
				},
			},
		},
	})

	const prevPost = prevPostRaw
		? {
				...prevPostRaw,
				tags: prevPostRaw.postToTag.map(association => association.tag),
				categories: prevPostRaw.postToCategory.map(
					association => association.category,
				),
			}
		: null

	const nextPost = nextPostRaw
		? {
				...nextPostRaw,
				tags: nextPostRaw.postToTag.map(association => association.tag),
				categories: nextPostRaw.postToCategory.map(
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
	typeof postTable.$inferInsert,
	'id' | 'createdAt' | 'updatedAt'
> & {
	tags: (typeof tagTable.$inferSelect)[]
	categories: (typeof categoryTable.$inferSelect)[]
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
			.insert(postTable)
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
			.insert(seoTable)
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
			.update(postTable)
			.set({
				authorId: authorId,
				title: title,
				content: content,
				slug: slug,
				excerpt: excerpt,
				status: status,
				featuredImage: featuredImage,
			})
			.where(eq(postTable.id, id))
			.returning()

		const author = authorId
			? ((await tx.query.user.findFirst({
					where: (users, { eq }) => eq(users.id, authorId),
				})) ?? null)
			: null

		const [seoUpdated] = await tx
			.update(seoTable)
			.set({
				metaTitle: seo.metaTitle || title,
				metaDescription: seo.metaDescription || '',
				route: '/blog/' + slug,
			})
			.where(eq(seoTable.postId, id))
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
		.delete(postTable)
		.where(eq(postTable.id, id))
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
		.from(tagTable)
		.where(inArray(tagTable.name, newTagNames))

	// Filter tags that with name already exist
	const tagsToInsert = newTags.filter(
		newTag => !existingNewTags.some(tag => tag.name === newTag.name),
	)

	// Insert new tags
	let insertedTags: Tag[] = []
	if (tagsToInsert.length > 0) {
		insertedTags = await tx
			.insert(tagTable)
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
	await tx.delete(postToTag).where(eq(postToTag.postId, postId))

	// Create new relations
	if (allTagIds.length > 0) {
		await tx.insert(postToTag).values(
			allTagIds.map(tagId => ({
				postId: postId,
				tagId: tagId,
			})),
		)

		return await tx
			.select()
			.from(tagTable)
			.where(inArray(tagTable.id, allTagIds))
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
		.from(categoryTable)
		.where(inArray(categoryTable.name, newCatNames))

	// Filter cats that with name already exist
	const catsToInsert = newCategories.filter(
		newCat => !existingNewCats.some(cat => cat.name === newCat.name),
	)

	// Insert new cats
	let insertedCats: Category[] = []
	if (catsToInsert.length > 0) {
		insertedCats = await tx
			.insert(categoryTable)
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

	await tx.delete(postToCategory).where(eq(postToCategory.postId, postId))

	if (allCatIds.length > 0) {
		await tx.insert(postToCategory).values(
			allCatIds.map(categoryId => ({
				postId: postId,
				categoryId: categoryId,
			})),
		)

		return await tx
			.select()
			.from(categoryTable)
			.where(inArray(categoryTable.id, allCatIds))
	}

	return []
}
