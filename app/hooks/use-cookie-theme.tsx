import { useRouteLoaderData } from 'react-router'

import type { loader } from '~/root'

export type Theme = 'light' | 'dark'

export const useHints = () => {
	const data = useRouteLoaderData<typeof loader>('root')
	return data?.requestInfo.hints
}

export const useCustomTheme = (): Theme | undefined => {
	const data = useRouteLoaderData<typeof loader>('root')
	return data?.requestInfo.customTheme
}

export const useCookieTheme = (): Theme => {
	const hints = useHints()
	const customTheme = useCustomTheme()

	return customTheme ?? hints?.theme ?? 'dark' // The fallback theme
}
