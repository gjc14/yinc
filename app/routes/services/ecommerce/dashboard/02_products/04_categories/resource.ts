import type { Route } from './+types/route'

import { createInsertSchema } from 'drizzle-zod'

import type { ActionResponse } from '~/lib/utils'
import { handleError } from '~/lib/utils/server'
import { validateAdminSession } from '~/routes/papa/auth/utils'

import { ecCategory } from '../../../lib/db/schema'
import { createEcCategory } from '../../../lib/db/taxonomy.server'

const categoryInsertUpdateSchema = createInsertSchema(ecCategory)

export const action = async ({ request }: Route.ActionArgs) => {
	await validateAdminSession(request)

	const jsonData = (await request.json()) as unknown

	try {
		switch (request.method) {
			case 'POST':
				const categoryData = categoryInsertUpdateSchema.parse(jsonData)
				const category = await createEcCategory(categoryData)
				return {
					msg: `Category ${category.name} created successfully`,
				} satisfies ActionResponse
			case 'PUT':
				return {} satisfies ActionResponse
			case 'DELETE':
				return {} satisfies ActionResponse
		}
	} catch (error) {
		return handleError(error, request)
	}
}
