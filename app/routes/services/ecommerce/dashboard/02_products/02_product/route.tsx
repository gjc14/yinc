import type { Route } from './+types/route'
import { useEffect } from 'react'

import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

import {
	getCrossSellProducts,
	getProduct,
	getProductGallery,
} from '../../../lib/db/product.server'
import {
	crossSellProductsAtom,
	productAtom,
	productGalleryAtom,
} from './context'
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

export default function ECProduct({ loaderData }: Route.ComponentProps) {
	useHydrateAtoms([[productAtom, loaderData.product]])
	const [, setCrossSellProductsAtom] = useAtom(crossSellProductsAtom)
	const [, setProductGalleryAtom] = useAtom(productGalleryAtom)

	// Resolve promises and set atoms after initial render
	useEffect(() => {
		loaderData.productGalleryPromise.then(gallery => {
			setProductGalleryAtom(gallery)
		})
		loaderData.crossSellProductsPromise.then(products => {
			setCrossSellProductsAtom(products)
		})
	}, [loaderData])

	return <ProductEditPage />
}
