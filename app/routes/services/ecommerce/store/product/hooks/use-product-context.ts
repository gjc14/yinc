import { useEffect } from 'react'

import { useAtom } from 'jotai'

import {
	crossSellProductsAtom,
	hoveredAttributeImageAtom,
	isResolvingAtom,
	productAtom,
	productGalleryAtom,
	selectedAttributesAtom,
	storeConfigAtom,
} from '../context'

/**
 * Hook to get product page context
 */
export const useProductContext = () => {
	const [storeConfig, setStoreConfig] = useAtom(storeConfigAtom)
	const [product, setProduct] = useAtom(productAtom)
	const [productGallery, setProductGallery] = useAtom(productGalleryAtom)
	const [crossSellProducts, setCrossSellProducts] = useAtom(
		crossSellProductsAtom,
	)
	const [isResolving, setIsResolving] = useAtom(isResolvingAtom)

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

	// ========================================
	// Return Public API
	// ========================================

	return {
		storeConfig,
		setStoreConfig,
		product,
		setProduct,
		productGallery,
		setProductGallery,
		crossSellProducts,
		setCrossSellProducts,
		isResolving,
		setIsResolving,

		selectedAttributes,
		setSelectedAttributes,
		hoveredAttributeImage,
		setHoveredAttributeImage,
	}
}
