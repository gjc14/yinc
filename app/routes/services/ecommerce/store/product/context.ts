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

type StoreConfig = {
	id: number
	/** Name of the store, used for SEO @default "Store" */
	name?: string
	/** Absolute path for the store @default "/store" */
	storeFrontPath?: string
}

export const storeConfigAtom = atom<StoreConfig | null>(null)

export const productAtom = atom<Awaited<ReturnType<typeof getProduct>>>(null)
export type Product = Awaited<ReturnType<typeof getProduct>>

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

export const selectedAttributesAtom = atom<Record<string, string>>({})

export const hoveredAttributeImageAtom = atom<{
	image: string
	imageAlt: string | null
	imageTitle: string | null
}>()
