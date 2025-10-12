/**
 * Dashboard E-Commerce Product CUD Route. For multiple products CUD, refer to /dashboard/ecommerce/products/resource
 * /dashboard/ecommerce/products/:productSlug/resource
 */
import type { Route } from './+types/resource'

import { validateAdminSession } from '~/routes/papa/auth/utils'

export const action = async ({ request, params }: Route.ActionArgs) => {
	const { user } = await validateAdminSession(request)

	return {}
}
