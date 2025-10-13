import { atom } from 'jotai'

import type {
	getCrossSellProducts,
	getProduct,
	getProductGallery,
} from '../../lib/db/product.server'

export const productAtom = atom<Awaited<ReturnType<typeof getProduct>> | null>(
	null,
)

export const productGalleryAtom = atom<Awaited<
	ReturnType<typeof getProductGallery>
> | null>(null)
export const crossSellProductsAtom = atom<Awaited<
	ReturnType<typeof getCrossSellProducts>
> | null>(null)

export const isResolvingAtom = atom<{
	productGallery: boolean
	crossSellProducts: boolean
}>({ productGallery: true, crossSellProducts: true })
