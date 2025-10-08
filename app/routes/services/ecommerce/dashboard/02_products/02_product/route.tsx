import type { Route } from './+types/route'

import { getProduct } from '../../../lib/db/product.server'
import { ProductEditPage } from './page'

export const loader = async ({ params }: Route.LoaderArgs) => {
	const product = await getProduct({
		slug: params.productSlug,
		edit: true,
	})
	return { product }
}

export default function ECProduct({ loaderData }: Route.ComponentProps) {
	return <ProductEditPage {...loaderData} />
}
