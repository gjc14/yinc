import { useProductPage } from '../../hooks/use-product-page'
import { ProductAction } from './product-action'
import { ProductAttributes } from './product-attributes'
import { ProductDetails } from './product-details'
import { ProductInformation } from './product-information'

export const ProductContent = () => {
	const { product } = useProductPage()

	if (!product) return null

	return (
		<section className="space-y-12">
			<ProductInformation />

			<ProductAction />

			{/* Details Tabs */}
			{product.details && <ProductDetails />}

			{/* Attributes */}
			<ProductAttributes />
		</section>
	)
}
