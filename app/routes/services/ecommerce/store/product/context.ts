import { atom } from 'jotai'

import type {
	getCrossSellProducts,
	getProduct,
	getProductGallery,
} from '../../lib/db/product.server'
import type {
	EcBrand as Brand,
	EcCategory as Category,
	EcTag as Tag,
} from '../../lib/db/schema'

export const productAtom = atom<Awaited<ReturnType<typeof getProduct>> | null>(
	null,
)

// === Product Related Data ===
export const productGalleryAtom = atom<Awaited<
	ReturnType<typeof getProductGallery>
> | null>(null)
export const crossSellProductsAtom = atom<Awaited<
	ReturnType<typeof getCrossSellProducts>
> | null>(null)

// === Taxonomies ===
export const tagsAtom = atom<Tag[]>([])
export const categoriesAtom = atom<Category[]>([])
export const brandsAtom = atom<Brand[]>([])

// === States ===
export const isResolvingAtom = atom<{
	productGallery: boolean
	crossSellProducts: boolean
}>({ productGallery: true, crossSellProducts: true })
