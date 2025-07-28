import type { loader } from './layout'

type LayoutLoader = Awaited<ReturnType<typeof loader>>

let cache: LayoutLoader | null = null

export const getCache = () => cache
export const setCache = (data: LayoutLoader) => (cache = data)
export const clearCache = () => (cache = null)
