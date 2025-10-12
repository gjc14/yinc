import { useMemo, useState } from 'react'

import { Button } from '~/components/ui/button'

import type { ProductContentProps } from '.'

export const ProductInformation = ({ product }: ProductContentProps) => {
	const variantProduct = product.variants.length > 0 // Check if there are variants

	// === Attribute Selection State for Variants ===
	const [selectedAttributes, setSelectedAttributes] = useState<
		Record<string, string>
	>({})

	// Extract attribute names and their possible values from variants
	// e.g. { color: Set { 'red', 'blue' }, size: Set { 'S', 'M', 'L' } }
	const attributeOptions = useMemo(
		() =>
			product.variants.reduce(
				(acc, variant) => {
					Object.entries(variant.combination).forEach(([attr, v]) => {
						if (!acc[attr]) {
							acc[attr] = new Set()
						}
						acc[attr].add(v)
					})
					return acc
				},
				{} as Record<string, Set<string>>,
			),
		[product.variants],
	)

	// Convert sets to sorted arrays
	const attributeKeys = product.attributes
		.filter(attr => {
			if (!attr.name) return false
			return Object.keys(attributeOptions).includes(attr.name)
		})
		.map(attr => attr.name!)
	const attributeValues = Object.fromEntries(
		Object.entries(attributeOptions).map(([k, v]) => [k, Array.from(v)]), // transform { key: Set } to { key: Array }
	) // [ key, string[] ] => { key: string[] }

	// Find matching variant based on selected attributes
	const selectedVariant = product.variants.find(variant => {
		const combination = variant.combination
		// Only check attributes that have been selected
		return Object.entries(combination).every(
			([key, value]) => selectedAttributes[key] === value,
		)
	})

	// Use the selected variant's option, or fall back to the default product option
	const selectedOption = selectedVariant?.option || product.option

	// Calculate the lowest price among variants that match current selections
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

	const getLowestPrice = (
		variants: ProductContentProps['product']['variants'],
	) => {
		return Math.min(
			...variants.map(
				variant => variant.option.salePrice || variant.option.price,
			),
		)
	}

	// Get current lowest price based on selection state if no exact variant is selected
	const displayPrice = (() => {
		if (variantProduct) {
			return selectedVariant
				? selectedVariant.option.salePrice || selectedVariant.option.price
				: getLowestPrice(filteredVariants)
		}
		return product.option.salePrice || product.option.price
	})()

	const hasDiscount = (() => {
		if (variantProduct) {
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
	})()

	const displayOriginalPrice = (() => {
		if (variantProduct) {
			return selectedVariant ? selectedVariant.option.price : undefined
		}
		return product.option.price
	})()

	// Check if a specific attribute value is available given current selections
	const isAttributeValueAvailable = (
		attributeName: string,
		attributeValue: string,
	) => {
		const testSelection = {
			...selectedAttributes,
			[attributeName]: attributeValue,
		}
		return product.variants.some(variant => {
			const combination = variant.combination
			// If any testSelection entry doesn't match, this variant isn't a match
			return Object.entries(testSelection).every(
				([key, value]) => combination[key] === value,
			)
		})
	}

	// Handle attribute selection
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

	const [, setHoveredAttributeImages] = useState<string[]>([])

	// Get variants that match a specific attribute value (considering current selections)
	const getVariantsForAttributeValue = (
		attributeName: string,
		attributeValue: string,
	) => {
		const testSelection = {
			...selectedAttributes,
			[attributeName]: attributeValue,
		}
		return product.variants.filter(variant => {
			const combination = variant.combination
			return Object.entries(testSelection).every(
				([key, value]) => combination[key] === value,
			)
		})
	}

	// Get images attribute value
	const getAttributeValueImages = (name: string, value: string) => {
		const variants = getVariantsForAttributeValue(name, value)
		return variants.map(variant => variant.option.image).filter(i => i !== null)
	}

	return (
		<>
			{/* Basic Info */}
			<div className="space-y-4">
				<div>
					<h1 className="mb-2 text-4xl font-light">{product.name}</h1>
					{product.subtitle && (
						<p className="text-primary/60 text-lg">{product.subtitle}</p>
					)}
				</div>
				<div className="my-8 flex items-baseline gap-3">
					<span className="text-3xl font-light">
						{variantProduct && !selectedVariant && 'From '}$
						{(displayPrice / 100).toFixed(2)}
					</span>
					{hasDiscount && displayOriginalPrice && (
						<span className="text-muted-foreground text-xl line-through">
							${(displayOriginalPrice / 100).toFixed(2)}
						</span>
					)}
				</div>
				{product.description && (
					<p className="text-primary/90 leading-relaxed">
						{product.description}
					</p>
				)}
			</div>

			{variantProduct && attributeKeys.length > 0 && (
				<>
					{/* Attribute Selection */}
					<div className="space-y-6">
						{attributeKeys.map(attrName => (
							<div key={attrName} className="space-y-3">
								<h3 className="text-sm font-medium tracking-wide uppercase">
									{attrName}
								</h3>
								<div className="flex flex-wrap gap-2">
									{attributeValues[attrName].map(attrValue => {
										const isAvailable = isAttributeValueAvailable(
											attrName,
											attrValue,
										)
										const isSelected =
											selectedAttributes[attrName] === attrValue

										return (
											<Button
												key={attrValue}
												onClick={() =>
													handleAttributeSelect(attrName, attrValue)
												}
												onMouseEnter={() => {
													const images = getAttributeValueImages(
														attrName,
														attrValue,
													)
													setHoveredAttributeImages(images)
												}}
												onMouseLeave={() => setHoveredAttributeImages([])}
												disabled={!isAvailable}
												variant={'ghost'}
												className={`rounded-none border-2 text-sm transition-colors ${
													isSelected
														? 'border-primary bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary dark:hover:bg-primary'
														: isAvailable
															? 'hover:border-muted-foreground cursor-pointer'
															: 'text-muted-foreground/30 cursor-not-allowed line-through'
												}`}
											>
												{attrValue}
											</Button>
										)
									})}
								</div>
							</div>
						))}
					</div>

					{/* Selected Option Display */}
					{selectedVariant && (
						<div className="border-border bg-accent space-y-2 rounded-md border-2 p-4">
							<h3 className="text-sm font-medium">Selected Option</h3>
							<div className="text-muted-foreground text-xs">
								SKU: {selectedOption.sku || 'N/A'}
							</div>
							<p className="text-muted-foreground text-sm">
								{attributeKeys.map((k, index) => (
									<span key={k}>
										{k}:{' '}
										<span className="text-primary font-medium">
											{selectedAttributes[k]}
										</span>
										{index < Object.entries(attributeKeys).length - 1 && ', '}
									</span>
								))}
							</p>
						</div>
					)}
				</>
			)}
		</>
	)
}
