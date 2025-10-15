import type { Route } from './+types/route'

import { createInsertSchema } from 'drizzle-zod'

import type { ActionResponse } from '~/lib/utils'
import { handleError } from '~/lib/utils/server'
import { validateAdminSession } from '~/routes/papa/auth/utils'

import { ecTag } from '../../../lib/db/schema'
import { createEcTag } from '../../../lib/db/taxonomy.server'

const tagInsertUpdateSchema = createInsertSchema(ecTag)

export const action = async ({ request }: Route.ActionArgs) => {
	await validateAdminSession(request)

	const jsonData = (await request.json()) as unknown

	try {
		switch (request.method) {
			case 'POST':
				const tagData = tagInsertUpdateSchema.parse(jsonData)
				const tag = await createEcTag(tagData)
				return {
					msg: `Tag ${tag.name} created successfully`,
					data: tag,
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
