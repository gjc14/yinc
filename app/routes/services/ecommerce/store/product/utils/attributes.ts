import type { Product, selectedAttributesAtom } from '../context'

/**
 * Get ordered attribute keys based on product.attributes
 * Only includes attributes that exist in variants and selectType is not HIDDEN
 */
const getAttributeKeys = (product: NonNullable<Product>) => {
	// Get all attribute names that exist in variants
	const variantAttributeNames = new Set(
		product.variants.flatMap(variant => Object.keys(variant.combination)),
	)

	return product.attributes
		.filter(attr => {
			if (!attr.name || attr.selectType === 'HIDDEN') return false
			return variantAttributeNames.has(attr.name)
		})
		.sort((a, b) => a.order - b.order)
		.map(attr => attr.name)
		.filter(v => v !== null)
}

/**
 * Get all possible values for each attribute from variants
 * e.g. { color: ['red', 'blue'], size: ['S', 'M', 'L'] }
 */
const getAttributeValues = (product: NonNullable<Product>) => {
	const valuesMap: Record<string, Set<string>> = {}

	// Collect all unique values for each attribute
	product.variants.forEach(variant => {
		Object.entries(variant.combination).forEach(([attr, value]) => {
			if (!valuesMap[attr]) {
				valuesMap[attr] = new Set()
			}
			valuesMap[attr].add(value)
		})
	})

	// Convert Sets to Arrays
	return Object.fromEntries(
		Object.entries(valuesMap).map(([key, valueSet]) => [
			key,
			Array.from(valueSet),
		]),
	)
}

// ========================================
// Availability Checks
// ========================================

/**
 * Check if a specific attribute value is available given current selections
 * Used to disable unavailable options in the UI
 */
const getIsAttributeValueAvailable = (props: {
	product: NonNullable<Product>
	selectedAttributes: ReturnType<typeof selectedAttributesAtom.read>
	attributeName: string
	attributeValue: string
}): boolean => {
	const { product, selectedAttributes, attributeName, attributeValue } = props

	const testSelection = {
		...selectedAttributes,
		[attributeName]: attributeValue, // Simulate selecting this value
	}
	return product.variants.some(variant => {
		const combination = variant.combination
		return Object.entries(testSelection).every(
			([key, value]) => combination[key] === value,
		)
	})
}

/**
 * Get all variants that would match if a specific attribute value is selected
 */
const getVariantsForAttributeValue = (props: {
	product: NonNullable<Product>
	selectedAttributes: ReturnType<typeof selectedAttributesAtom.read>
	attributeName: string
	attributeValue: string
}) => {
	const { product, selectedAttributes, attributeName, attributeValue } = props

	const testSelection = {
		...selectedAttributes,
		[attributeName]: attributeValue, // Simulate selecting this value
	}
	return product.variants.filter(variant => {
		const combination = variant.combination
		return Object.entries(testSelection).every(
			([key, value]) => combination[key] === value,
		)
	})
}

/**
 * Get images for variants matching a specific attribute value
 * Useful for hover previews
 */
const getAttributeValueImage = (props: {
	product: NonNullable<Product>
	selectedAttributes: ReturnType<typeof selectedAttributesAtom.read>
	attributeName: string
	attributeValue: string
}) => {
	const variants = getVariantsForAttributeValue(props)

	// Find the first variant (after ordering) that has an image and return its image info
	const match = variants
		.sort((a, b) => a.order - b.order)
		.find(variant => !!variant.option.image)

	if (!match || !match.option.image) return undefined

	return {
		image: match.option.image,
		imageAlt: match.option.imageAlt,
		imageTitle: match.option.imageTitle,
	}
}

export {
	getAttributeKeys,
	getAttributeValues,
	getIsAttributeValueAvailable,
	getVariantsForAttributeValue,
	getAttributeValueImage,
}
