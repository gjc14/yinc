import { ActionFunctionArgs } from '@remix-run/node'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import pkg from 'pg'
import { z } from 'zod'

import { userIs } from '~/lib/db/auth.server'
import { createPost, deletePost, updatePost } from '~/lib/db/post.server'
import { categoriesTable, postsTable, tagsTable } from '~/lib/db/schema'
import { ConventionalActionResponse } from '~/lib/utils'

const { DatabaseError } = pkg

/**
 * createInsertSchema(postsTable) is used for create and update
 * Because the updatePost() also requires complete date to update
 */
const postInsertUpdateSchema = createInsertSchema(postsTable)
const taxonomyInsertUpdateSchema = z.object({
    tags: createSelectSchema(tagsTable).array(),
    categories: createSelectSchema(categoriesTable).array(),
})
const seoInsertUpdateSchema = z.object({
    seo: z.object({
        metaTitle: z.string().nullable(),
        metaDescription: z.string().nullable(),
    }),
})

export const action = async ({ request }: ActionFunctionArgs) => {
    await userIs(request, ['ADMIN'])

    const jsonData = await request.json()

    switch (request.method) {
        case 'POST':
            try {
                const postData = postInsertUpdateSchema.parse(jsonData)
                const taxonomyData = taxonomyInsertUpdateSchema.parse(jsonData)
                const seoData = seoInsertUpdateSchema.parse(jsonData)

                const { post } = await createPost({
                    ...postData,
                    ...taxonomyData,
                    ...seoData,
                })

                return {
                    msg: `Post ${post.title} created successfully`,
                    data: {
                        slug: post.slug,
                    },
                } satisfies ConventionalActionResponse<{ slug: string }>
            } catch (error) {
                return handleError(error, request)
            }

        case 'PUT':
            try {
                const postData = postInsertUpdateSchema.parse(jsonData)
                const taxonomyData = taxonomyInsertUpdateSchema.parse(jsonData)
                const seoData = seoInsertUpdateSchema.parse(jsonData)

                if (!postData.id) {
                    throw new Error('Post ID is required for update')
                }

                const { post } = await updatePost({
                    id: postData.id,
                    ...postData,
                    ...taxonomyData,
                    ...seoData,
                })

                return {
                    msg: `Post ${post.title} updated successfully`,
                } satisfies ConventionalActionResponse
            } catch (error) {
                return handleError(error, request)
            }

        case 'DELETE':
            try {
                if (
                    jsonData &&
                    typeof jsonData === 'object' &&
                    'id' in jsonData &&
                    typeof jsonData.id === 'number'
                ) {
                    const { post } = await deletePost(jsonData.id)
                    return {
                        msg: `Post ${post.title} deleted successfully`,
                    } satisfies ConventionalActionResponse
                } else {
                    throw new Error('Invalid argument')
                }
            } catch (error) {
                return handleError(error, request)
            }

        default:
            throw new Response('Method not allowed', { status: 405 })
    }
}

const handleError = (error: unknown, request: Request) => {
    if (error instanceof z.ZodError) {
        console.error(error.message)
        return Response.json({
            err: 'Internal error: Invalid argument',
        } satisfies ConventionalActionResponse)
    }

    if (error instanceof DatabaseError) {
        console.error(error)
        return Response.json({
            err: error.detail ?? 'Database error',
        } satisfies ConventionalActionResponse)
    }

    if (error instanceof Error) {
        console.error(error.message)
        return Response.json({
            err: error.message,
        } satisfies ConventionalActionResponse)
    }

    console.error(error)
    return Response.json({
        err: 'Internal error: Unknown error',
    } satisfies ConventionalActionResponse)
}
