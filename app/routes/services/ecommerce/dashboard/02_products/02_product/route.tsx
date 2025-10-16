import type { Route } from './+types/route'
import { useEffect } from 'react'
import { type ShouldRevalidateFunctionArgs } from 'react-router'

import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

import {
	getCrossSellProducts,
	getProduct,
	getProductGallery,
} from '../../../lib/db/product.server'
import {
	crossSellProductsAtom,
	isResolvingAtom,
	productAtom,
	productGalleryAtom,
} from '../../../store/product/context'
import { ProductEditPage } from './page'

export const loader = async ({ params }: Route.LoaderArgs) => {
	const product = await getProduct({
		slug: params.productSlug,
		edit: true,
	})

	if (!product) {
		throw new Response('Product Not Found', { status: 404 })
	}

	const productGalleryPromise = new Promise<
		Awaited<ReturnType<typeof getProductGallery>>
	>(async resolve => {
		const gallery = await getProductGallery(product.id)
		// Insert main product image as first image if exists
		if (product.option.image) {
			gallery.unshift({
				image: product.option.image,
				productId: product.id,
				order: 0,
				alt: product.name,
				title: product.name,
			})
		}
		resolve(gallery)
	})

	const crossSellProductsPromise = getCrossSellProducts(product.id)

	return { product, productGalleryPromise, crossSellProductsPromise }
}

// To prevent revalidation when fetchers are called (taxonomies, brands, etc.)
// Please call revalidate() manually when updating product
export const shouldRevalidate = ({
	currentParams,
	nextParams,
}: ShouldRevalidateFunctionArgs) => {
	return currentParams !== nextParams
}

export default function ECProduct({ loaderData }: Route.ComponentProps) {
	useHydrateAtoms([[productAtom, loaderData.product]])
	const [, setProduct] = useAtom(productAtom)
	const [, setIsResolving] = useAtom(isResolvingAtom)
	const [, setCrossSellProducts] = useAtom(crossSellProductsAtom)
	const [, setProductGallery] = useAtom(productGalleryAtom)

	useEffect(() => {
		setProduct(loaderData.product)
		setIsResolving({
			crossSellProducts: true,
			productGallery: true,
		})

		// Resolve promises
		loaderData.crossSellProductsPromise
			.then(setCrossSellProducts)
			.finally(() => setIsResolving(r => ({ ...r, crossSellProducts: false })))
		loaderData.productGalleryPromise
			.then(setProductGallery)
			.finally(() => setIsResolving(r => ({ ...r, productGallery: false })))

		return () => {
			setProduct(null)
			setIsResolving({ crossSellProducts: false, productGallery: false })
			setCrossSellProducts([])
			setProductGallery([])
		}
	}, [loaderData])

	return <ProductEditPage />
}
