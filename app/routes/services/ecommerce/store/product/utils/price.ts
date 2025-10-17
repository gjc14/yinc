import type { Product, selectedAttributesAtom } from '../context'
import {
	getFilteredVariants,
	getHasVariants,
	getSelectedVariant,
} from './variants'

// ========================================
// Price Calculations
// ========================================

/**
 * Get the lowest price from a list of variants
 */
const getLowestPrice = (variants: NonNullable<Product>['variants']) => {
	return Math.min(
		...variants.map(
			variant => variant.option.salePrice || variant.option.price,
		),
	)
}

/**
 * Display price based on selection state
 * - If exact variant selected: show its price
 * - If partial selection: show lowest price from filtered variants
 * - If no variants: show product price
 */
const getDisplayPrice = (props: {
	product: NonNullable<Product>
	selectedAttributes: ReturnType<typeof selectedAttributesAtom.read>
}) => {
	const hasVariants = getHasVariants(props.product)

	if (hasVariants) {
		const selectedVariant = getSelectedVariant(props)
		const filteredVariants = getFilteredVariants(props)
		return selectedVariant
			? selectedVariant.option.salePrice || selectedVariant.option.price
			: getLowestPrice(filteredVariants)
	}
	return props.product.option.salePrice || props.product.option.price
}

/**
 * Check if there's a discount on the displayed price
 */
const getHasDiscount = (props: {
	product: NonNullable<Product>
	selectedAttributes: ReturnType<typeof selectedAttributesAtom.read>
}) => {
	const hasVariants = getHasVariants(props.product)

	if (hasVariants) {
		const selectedVariant = getSelectedVariant(props)
		const selectedOption = selectedVariant?.option || props.product.option
		return (
			selectedOption &&
			!!selectedOption.salePrice &&
			selectedOption.salePrice < selectedOption.price
		)
	}

	return (
		!!props.product.option.salePrice &&
		props.product.option.salePrice < props.product.option.price
	)
}

/**
 * Original price before discount (if applicable)
 */
const getDisplayOriginalPrice = (props: {
	product: NonNullable<Product>
	selectedAttributes: ReturnType<typeof selectedAttributesAtom.read>
}) => {
	const hasVariants = getHasVariants(props.product)

	if (hasVariants) {
		const selectedVariant = getSelectedVariant(props)
		return selectedVariant ? selectedVariant.option.price : undefined
	}
	return props.product.option.price
}

const getPricing = (props: {
	product: NonNullable<Product>
	selectedAttributes: ReturnType<typeof selectedAttributesAtom.read>
}) => {
	return {
		displayPrice: getDisplayPrice(props),
		hasDiscount: getHasDiscount(props),
		displayOriginalPrice: getDisplayOriginalPrice(props),
	}
}

export { getPricing, getDisplayPrice, getHasDiscount, getDisplayOriginalPrice }
