import { useAtom } from 'jotai'

import { productAtom } from '../../context'
import { ProductAction } from './product-action'
import { ProductAttributes } from './product-attributes'
import { ProductDetails } from './product-details'
import { ProductInformation } from './product-information'

export const ProductContent = () => {
	const [product] = useAtom(productAtom)

	if (!product) return null

	return (
		<section className="space-y-12">
			<ProductInformation product={product} />

			<ProductAction product={product} />

			{/* Details Tabs */}
			{product.details && <ProductDetails details={product.details} />}

			{/* Attributes */}
			<ProductAttributes productAttributes={product.attributes} />
		</section>
	)
}
