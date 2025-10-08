import { Button } from '~/components/ui/button'
import type { productAttribute } from '~/routes/services/ecommerce/lib/db/schema'

import type {
	ProductVariant,
	ProductWithOption,
} from '../../../../lib/db/product.server'
import { ProductAttributes } from './product-attributes'
import { ProductDetails } from './product-details'
import { ProductInformation } from './product-information'

export type ProductContentProps = {
	product: ProductWithOption
	productVariants: ProductVariant[]
	productAttributes: Omit<
		typeof productAttribute.$inferSelect,
		'productId' | 'attributeId'
	>[]
}

export const ProductContent = ({
	product,
	productVariants,
	productAttributes,
}: ProductContentProps) => {
	return (
		<section className="space-y-12">
			<ProductInformation
				product={product}
				productVariants={productVariants}
				productAttributes={productAttributes}
			/>

			<div className="flex items-center gap-2">
				<Button
					variant={'ghost'}
					// disabled={!isSelectionComplete}
					className="text-primary-foreground bg-primary hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground h-12 flex-1 rounded-none border-1 border-transparent"
				>
					Buy Now
				</Button>
				<Button
					variant={'ghost'}
					// disabled={!isSelectionComplete}
					className="text-primary bg-primary-foreground hover:border-accent-foreground h-12 rounded-none border-1"
				>
					Add to Cart
				</Button>
			</div>

			{/* Details Tabs */}
			{product.details && <ProductDetails details={product.details} />}

			{/* Attributes */}
			<ProductAttributes productAttributes={productAttributes} />
		</section>
	)
}
