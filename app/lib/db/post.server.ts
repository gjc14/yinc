import { asc, desc, eq, gt, inArray, like, lt, SQL } from 'drizzle-orm'

import { db } from '~/lib/db/db.server'
import {
    categoriesTable,
    Category,
    Post,
    postsTable,
    PostStatus,
    postsToCategories,
    postsToTags,
    Seo,
    seosTable,
    Tag,
    tagsTable,
    User,
} from '~/lib/db/schema'

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
        categoryFilter?: string[]
        tagFilter?: string[]
        titleQuery?: string
    } = {}
): Promise<{
    posts: PostWithRelations[]
    nextCursor: number | null
    prevCursor: number | null
    totalCount: number
    hasMore: boolean
}> => {
    const {
        cursor,
        pageSize = 10,
        direction = 'next',
        status = 'PUBLISHED', // Default status is PUBLISHED
        categoryFilter = [],
        tagFilter = [],
        titleQuery = '',
    } = props

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
                ...(tagFilter.length > 0
                    ? [inArray(tagsTable.name, tagFilter)]
                    : []),
                ...(categoryFilter.length > 0
                    ? [inArray(categoriesTable.name, categoryFilter)]
                    : [])
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
            tags: post.postsToTags.map(relation => relation.tag),
            categories: post.postsToCategories.map(
                relation => relation.category
            ),
        }
    })

    const hasMore = posts.length > pageSize

    const pagePosts = hasMore ? posts.slice(0, pageSize) : posts

    const resultPosts =
        direction === 'previous' ? pagePosts.reverse() : pagePosts

    // Calculate next and previous cursors
    const nextCursor =
        resultPosts.length > 0 ? resultPosts[resultPosts.length - 1].id : null
    const prevCursor = resultPosts.length > 0 ? resultPosts[0].id : null

    return {
        posts,
        nextCursor: hasMore ? nextCursor : null,
        prevCursor: cursor ? prevCursor : null,
        totalCount: posts.length,
        hasMore,
    }
}

export const getPost = async (
    id: number
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
              tags: postRaw.postsToTags.map(relation => relation.tag),
              categories: postRaw.postsToCategories.map(
                  relation => relation.category
              ),
          }
        : null

    return { post }
}

export const getPostBySlug = async (
    slug: string,
    status: PostStatus = 'PUBLISHED'
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
        tags: postRaw.postsToTags.map(relation => relation.tag),
        categories: postRaw.postsToCategories.map(
            relation => relation.category
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
              tags: prevPostRaw.postsToTags.map(relation => relation.tag),
              categories: prevPostRaw.postsToCategories.map(
                  relation => relation.category
              ),
          }
        : null

    const nextPost = nextPostRaw
        ? {
              ...nextPostRaw,
              tags: nextPostRaw.postsToTags.map(relation => relation.tag),
              categories: nextPostRaw.postsToCategories.map(
                  relation => relation.category
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
    tags: Pick<Tag, 'id'>[]
    categories: Pick<Category, 'id'>[]
} & {
    seo: Pick<Seo, 'metaDescription' | 'metaTitle'>
}

export const createPost = async (
    props: CreatePostProps
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
            ? (await tx.query.usersTable.findFirst({
                  where: (users, { eq }) => eq(users.id, authorId),
              })) ?? null
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

        let tagsRelated: Tag[] = []
        if (tags.length > 0) {
            const postsToTagsUpdated = await tx
                .insert(postsToTags)
                .values(
                    tags.map(tag => ({
                        postId: postCreated.id,
                        tagId: tag.id,
                    }))
                )
                .returning()

            const tagIds = postsToTagsUpdated.map(relation => relation.tagId)

            tagsRelated = await tx
                .select()
                .from(tagsTable)
                .where(inArray(tagsTable.id, tagIds))
        }

        let categoriesRelated: Category[] = []
        if (categories.length > 0) {
            const postsToCategoriesUpdated = await tx
                .insert(postsToCategories)
                .values(
                    categories.map(category => ({
                        postId: postCreated.id,
                        categoryId: category.id,
                    }))
                )
                .returning()

            const categoryIds = postsToCategoriesUpdated.map(
                relation => relation.categoryId
            )

            categoriesRelated = await tx
                .select()
                .from(categoriesTable)
                .where(inArray(categoriesTable.id, categoryIds))
        }

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
    props: UpdatePostProps
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
            ? (await tx.query.usersTable.findFirst({
                  where: (users, { eq }) => eq(users.id, authorId),
              })) ?? null
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

        let tagsRelated: Tag[] = []

        const postsToTagsUpdated = await tx
            .delete(postsToTags)
            .where(eq(postsToTags.postId, id))
            .returning()
            .then(() => {
                if (tags.length === 0) return [] // Ment to delete all
                return tx
                    .insert(postsToTags)
                    .values(
                        tags.map(tag => ({
                            postId: id,
                            tagId: tag.id,
                        }))
                    )
                    .returning()
            })

        if (postsToTagsUpdated.length > 0) {
            const tagIds = postsToTagsUpdated.map(relation => relation.tagId)
            tagsRelated = await tx
                .select()
                .from(tagsTable)
                .where(inArray(tagsTable.id, tagIds))
        }

        let categoriesRelated: Category[] = []

        const postsToCategoriesUpdated = await tx
            .delete(postsToCategories)
            .where(eq(postsToCategories.postId, id))
            .returning()
            .then(() => {
                if (categories.length === 0) return [] // Ment to delete all
                return tx
                    .insert(postsToCategories)
                    .values(
                        categories.map(category => ({
                            postId: id,
                            categoryId: category.id,
                        }))
                    )
                    .returning()
            })

        if (postsToCategoriesUpdated.length > 0) {
            const categoryIds = postsToCategoriesUpdated.map(
                relation => relation.categoryId
            )
            categoriesRelated = await tx
                .select()
                .from(categoriesTable)
                .where(inArray(categoriesTable.id, categoryIds))
        }

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
