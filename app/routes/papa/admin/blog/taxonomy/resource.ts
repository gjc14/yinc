import { redirect, type ActionFunctionArgs } from 'react-router'

import { z } from 'zod'

import type { Category, SubCategory, Tag } from '~/lib/db/schema'
import {
	createCategory,
	createSubcategory,
	createTag,
	deleteCategory,
	deleteSubcategory,
	deleteTag,
} from '~/lib/db/taxonomy.server'
import { type ConventionalActionResponse } from '~/lib/utils'
import { handleError } from '~/lib/utils/server'
import { validateAdminSession } from '~/routes/papa/auth/utils'

const intentSchema = z.enum(['category', 'subcategory', 'tag'])
export type Intents = z.infer<typeof intentSchema>

// Schema for both category and tag
export const taxonomySchema = z.object({
	id: z.string().transform(val => Number(val)),
	name: z.string(),
	description: z.string().optional(),
})

const subTaxonomySchema = z.object({
	id: z.string().transform(val => Number(val)),
	parentId: z.string().transform(val => Number(val)),
	name: z.string(),
	description: z.string().optional(),
})

const deleteSchema = z.object({
	id: z.string().transform(val => Number(val)),
})

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== 'POST' && request.method !== 'DELETE') {
		throw new Response('', { status: 405, statusText: 'Method not allowd' })
	}

	await validateAdminSession(request)

	const formData = await request.formData()
	const intent = formData.get('intent')

	const { data, success } = intentSchema.safeParse(intent)

	if (!success) {
		throw new Response('', { status: 400, statusText: 'Invalid argument' })
	}

	const formObject = Object.fromEntries(formData)

	const errorMessage = `Failed to ${
		request.method === 'POST' ? 'create' : 'delete'
	} ${intent}`

	switch (data) {
		case 'category': {
			const deleteMesage = (name: string) => {
				return '類別 ' + name + ' 已刪除'
			}

			try {
				if (request.method === 'POST') {
					const { id, name, description } = taxonomySchema.parse(formObject)
					const { category } = await createCategory({
						name,
						description,
					})
					return {
						msg: 'New category created',
						data: { ...category, originalId: id },
						options: {
							preventAlert: true,
						},
					} satisfies ConventionalActionResponse<
						Category & { originalId: number }
					>
				} else if (request.method === 'DELETE') {
					const { id } = deleteSchema.parse(formObject)
					const { category } = await deleteCategory(id)
					if (!category) {
						return {
							err: 'Category not found',
						} satisfies ConventionalActionResponse
					}
					return {
						msg: deleteMesage(category.name),
					} satisfies ConventionalActionResponse
				}
			} catch (error) {
				return handleError(error, request, {
					errorMessage,
				})
			}
		}

		case 'subcategory': {
			const deleteMesage = (name: string) => {
				return '子類別 ' + name + ' 已刪除'
			}

			try {
				if (request.method === 'POST') {
					const { id, parentId, name, description } =
						subTaxonomySchema.parse(formObject)
					const { subcategory } = await createSubcategory({
						categoryId: parentId,
						name,
						description,
					})
					return {
						msg: 'New subcategory created',
						data: { ...subcategory, originalId: id },
						options: {
							preventAlert: true,
						},
					} satisfies ConventionalActionResponse<
						SubCategory & { originalId: number }
					>
				} else if (request.method === 'DELETE') {
					const { id } = deleteSchema.parse(formObject)
					const { subcategory } = await deleteSubcategory(id)
					if (!subcategory) {
						return {
							err: 'Subcategory not found',
						} satisfies ConventionalActionResponse
					}
					return {
						msg: deleteMesage(subcategory.name),
					} satisfies ConventionalActionResponse
				}
			} catch (error) {
				return handleError(error, request, {
					errorMessage,
				})
			}
		}

		case 'tag': {
			const deleteMesage = (name: string) => {
				return '標籤 ' + name + ' 已刪除'
			}

			try {
				if (request.method === 'POST') {
					const { id, name, description } = taxonomySchema.parse(formObject)
					const { tag } = await createTag({ name, description })
					return {
						msg: 'New tag created',
						data: { ...tag, originalId: id },
						options: {
							preventAlert: true,
						},
					} satisfies ConventionalActionResponse<Tag & { originalId: number }>
				} else if (request.method === 'DELETE') {
					const { id } = deleteSchema.parse(formObject)
					const { tag } = await deleteTag(id)
					if (!tag) {
						return {
							err: 'Tag not found',
						} satisfies ConventionalActionResponse
					}
					return {
						msg: deleteMesage(tag.name),
					} satisfies ConventionalActionResponse
				}
			} catch (error) {
				return handleError(error, request, {
					errorMessage,
				})
			}
		}

		default: {
			throw new Response('', { status: 400, statusText: 'Invalid argument' })
		}
	}
}

export const loader = () => {
	return redirect('/admin/blog')
}

export default function AdminPostsActionTaxonomy() {
	return null
}
