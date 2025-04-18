import { type ActionFunctionArgs } from 'react-router'

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { createPost, deletePost, updatePost } from '~/lib/db/post.server'
import { categoriesTable, postsTable, tagsTable } from '~/lib/db/schema'
import { type ConventionalActionResponse } from '~/lib/utils'
import { handleError } from '~/lib/utils/server'

import { validateAdminSession } from '../../auth/utils'

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
	await validateAdminSession(request)

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
					data: post,
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
					data: post,
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
						data: post,
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
