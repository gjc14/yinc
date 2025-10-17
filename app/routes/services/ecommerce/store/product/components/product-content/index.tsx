import { useProductContext } from '../../hooks/use-product-context'
import { ProductAction } from './product-action'
import { ProductAttributes } from './product-attributes'
import { ProductInformation } from './product-information'
import { ProductInstructions } from './product-instructions'

export const ProductContent = () => {
	const { product } = useProductContext()

	if (!product) return null

	return (
		<section className="space-y-12">
			<ProductInformation />

			<ProductAction />

			{/* Instructions Tabs */}
			{product.instructions && <ProductInstructions />}

			{/* Attributes */}
			<ProductAttributes />
		</section>
	)
}
