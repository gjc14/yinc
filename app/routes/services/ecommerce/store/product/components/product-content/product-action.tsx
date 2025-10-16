import { Button } from '~/components/ui/button'

import { useProductContext } from '../../hooks/use-product-context'
import { getHasVariants, getSelectedVariant } from '../../utils/variants'

export const ProductAction = () => {
	const { product, selectedAttributes } = useProductContext()

	if (!product) return null

	const hasVariants = getHasVariants(product)
	const selectedVariant = getSelectedVariant({ product, selectedAttributes })

	return (
		<div className="flex flex-col items-center gap-2">
			<Button
				variant={'ghost'}
				disabled={hasVariants ? !selectedVariant : false}
				className="text-primary-foreground bg-primary hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground h-12 w-full rounded-none border-1 border-transparent"
			>
				Buy Now
			</Button>
			<Button
				variant={'ghost'}
				disabled={hasVariants ? !selectedVariant : false}
				className="text-primary bg-primary-foreground hover:border-accent-foreground h-12 w-full rounded-none border-1"
			>
				Add to Cart
			</Button>
		</div>
	)
}
