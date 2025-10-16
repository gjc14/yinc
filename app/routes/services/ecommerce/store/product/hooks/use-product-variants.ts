import { useEffect, useMemo } from 'react'

import { useAtom } from 'jotai'

import {
	hoveredAttributeImageAtom,
	selectedAttributesAtom,
	type Product,
} from '../context'

/**
 * Hook for managing product variants logic
 * Handles attribute selection, variant matching, and price calculations
 */
export const useProductVariants = (product: NonNullable<Product>) => {
	const [selectedAttributes, setSelectedAttributes] = useAtom(
		selectedAttributesAtom,
	)
	const [hoveredAttributeImage, setHoveredAttributeImage] = useAtom(
		hoveredAttributeImageAtom,
	)

	useEffect(() => {
		return () => {
			setSelectedAttributes({})
			setHoveredAttributeImage(undefined)
		}
	}, [])

	const hasVariants = product.variants.length > 0

	// ========================================
	// Attribute Entries
	// ========================================

	/**
	 * Get ordered attribute keys based on product.attributes
	 * Only includes attributes that exist in variants and selectType is not HIDDEN
	 */
	const attributeKeys = useMemo(() => {
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
	}, [product.variants, product.attributes])

	/**
	 * Get all possible values for each attribute from variants
	 * e.g. { color: ['red', 'blue'], size: ['S', 'M', 'L'] }
	 */
	const attributeValues = useMemo(() => {
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
	}, [product.variants])

	// ========================================
	// Variant Selection & Filtering
	// ========================================
	// 1. No selectedAttributes.length = 0 -> all variants available
	// 2. Some selectedAttributes.length > 0 -> filter variants that match all selected
	// 3. All attributes selected -> find exact matching variant

	/**
	 * Filter variants that match currently selected attributes
	 * Used for calculating price ranges when no exact variant is selected
	 */
	const filteredVariants = useMemo(() => {
		// If no attributes are selected, return all variants
		if (Object.keys(selectedAttributes).length === 0) {
			return product.variants
		}

		// Filter variants that match the selected attributes
		return product.variants.filter(variant => {
			const combination = variant.combination
			return Object.entries(selectedAttributes).every(
				([key, value]) => combination[key] === value,
			)
		})
	}, [selectedAttributes, product.variants])

	/**
	 * Find the variant that exactly matches all selected attributes
	 */
	const selectedVariant = useMemo(
		() =>
			product.variants.find(variant => {
				const combination = variant.combination
				// Only check attributes that have been selected
				return Object.entries(combination).every(
					([key, value]) => selectedAttributes[key] === value,
				)
			}),
		[product.variants, selectedAttributes],
	)

	/**
	 * The currently selected option (variant or default product option)
	 */
	const selectedOption = selectedVariant?.option || product.option

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
	const displayPrice = useMemo(() => {
		if (hasVariants) {
			return selectedVariant
				? selectedVariant.option.salePrice || selectedVariant.option.price
				: getLowestPrice(filteredVariants)
		}
		return product.option.salePrice || product.option.price
	}, [hasVariants, selectedVariant, filteredVariants, product.option])

	/**
	 * Check if there's a discount on the displayed price
	 */
	const hasDiscount = useMemo(() => {
		if (hasVariants) {
			return (
				selectedOption &&
				!!selectedOption.salePrice &&
				selectedOption.salePrice < selectedOption.price
			)
		}
		return (
			!!product.option.salePrice &&
			product.option.salePrice < product.option.price
		)
	}, [hasVariants, selectedOption, product.option])

	/**
	 * Original price before discount (if applicable)
	 */
	const displayOriginalPrice = useMemo(() => {
		if (hasVariants) {
			return selectedVariant ? selectedVariant.option.price : undefined
		}
		return product.option.price
	}, [hasVariants, selectedVariant, product.option.price])

	// ========================================
	// Availability Checks
	// ========================================

	/**
	 * Check if a specific attribute value is available given current selections
	 * Used to disable unavailable options in the UI
	 */
	const isAttributeValueAvailable = (
		attributeName: string,
		attributeValue: string,
	): boolean => {
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
	const getVariantsForAttributeValue = (
		attributeName: string,
		attributeValue: string,
	) => {
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
	const getAttributeValueImage = (
		attributeName: string,
		attributeValue: string,
	) => {
		const variants = getVariantsForAttributeValue(attributeName, attributeValue)

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

	// ========================================
	// Actions
	// ========================================

	/**
	 * Handle attribute selection/deselection
	 * Clicking the same value again will deselect it
	 */
	const handleAttributeSelect = (attributeName: string, value: string) => {
		setSelectedAttributes(prev => {
			const newSelection = { ...prev }
			if (newSelection[attributeName] === value) {
				delete newSelection[attributeName] // Deselect if clicking the same value
			} else {
				newSelection[attributeName] = value
			}
			return newSelection
		})
	}

	/**
	 * Reset all attribute selections
	 */
	const resetSelection = () => {
		setSelectedAttributes({})
	}

	// ========================================
	// Return Public API
	// ========================================

	return {
		// State
		selectedAttributes,
		hasVariants,
		hoveredAttributeImage,
		setHoveredAttributeImage,

		// Attributes
		attributeKeys,
		attributeValues,

		// Selection
		filteredVariants,
		selectedVariant,
		selectedOption,

		// Pricing
		displayPrice,
		hasDiscount,
		displayOriginalPrice,

		// Availability checks
		isAttributeValueAvailable,
		getAttributeValueImage,

		// Actions
		handleAttributeSelect,
		resetSelection,
	}
}
