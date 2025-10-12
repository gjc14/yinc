import { atom } from 'jotai'

import type { loader } from './route'

type LoaderReturnType = Awaited<ReturnType<typeof loader>>

export const productAtom = atom<LoaderReturnType['product'] | null>(null)
export const productGalleryAtom = atom<Awaited<
	LoaderReturnType['productGalleryPromise']
> | null>(null)
export const crossSellProductsAtom = atom<Awaited<
	LoaderReturnType['crossSellProductsPromise']
> | null>(null)
