import { ActionFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'
import pkg from 'pg'
import { z } from 'zod'

import { userIs } from '~/lib/db/auth.server'
import { deletePost, getPosts } from '~/lib/db/post.server'
import { getCategories, getTags } from '~/lib/db/taxonomy.server'
import { ConventionalActionResponse } from '~/lib/utils'
import { useAdminContext } from '~/routes/_papa.admin/route'

const { DatabaseError } = pkg

export const action = async ({ request }: ActionFunctionArgs) => {
    await userIs(request, ['ADMIN'])

    const jsonData = await request.json()

    switch (request.method) {
        case 'POST':
            try {
                console.log('Creating post', jsonData)
                // const { post } = await createPost({} as PostWithRelations)

                return {
                    msg: `Post created successfully`,
                } satisfies ConventionalActionResponse
            } catch (error) {
                return handleError(error, request)
            }

        case 'PUT':
            try {
                console.log('Updating post', jsonData)
                // const { post } = await updatePost({} as PostWithRelations)

                return {
                    msg: `Post updated successfully`,
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

export const loader = async () => {
    try {
        const { posts } = await getPosts({ status: 'ALL' })
        const { tags } = await getTags()
        const { categories } = await getCategories()
        return { posts, tags, categories }
    } catch (error) {
        console.error(error)
        return { posts: [], categories: [], tags: [] }
    }
}

export default function AdminBlog() {
    const loaderDate = useLoaderData<typeof loader>()
    const adminContext = useAdminContext()

    return <Outlet context={{ ...loaderDate, ...adminContext }} />
}

export const useAdminBlogContext = () => {
    return useOutletContext<
        ReturnType<typeof useLoaderData<typeof loader>> &
            ReturnType<typeof useAdminContext>
    >()
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
