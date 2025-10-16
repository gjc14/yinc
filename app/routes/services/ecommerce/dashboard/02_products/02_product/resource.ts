/**
 * Dashboard E-Commerce Product CUD Route. For multiple products CUD, refer to /dashboard/ecommerce/products/resource
 * /dashboard/ecommerce/products/:productSlug/resource
 *
 * Load products for Linked Products selection
 */
import type { Route } from './+types/resource'

import { validateAdminSession } from '~/routes/papa/auth/utils'

import { getProducts } from '../../../lib/db/product.server'

export const action = async ({ request, params }: Route.ActionArgs) => {
	const { user } = await validateAdminSession(request)

	return {}
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const url = new URL(request.url)
	const { searchParams } = url
	const categories = searchParams.get('category')?.split(',')
	const tags = searchParams.get('tag')?.split(',')
	const brands = searchParams.get('brand')?.split(',')
	const attributes = searchParams.get('attribute')?.split(',')
	const title = searchParams.get('q') || undefined

	const products = await getProducts({
		categories,
		tags,
		brands,
		attributes,
		title,
	})

	return { products }
}
