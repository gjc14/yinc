import { createContext, useContext } from 'react'
import { useRevalidator } from 'react-router'

import { type Theme } from '~/hooks/use-cookie-theme'

type ThemeProviderState = {
	theme: Theme
	setTheme: (theme: Theme | undefined) => void
}

const initialState: ThemeProviderState = {
	theme: 'dark', // Just a init value, to set fallback, please set the return of useCookieTheme()
	setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
	children,
	cookieTheme,
	...props
}: {
	children: React.ReactNode
	cookieTheme: Theme
}) {
	const { revalidate } = useRevalidator()

	// You could use { setTheme } = useTheme() somewhere in the children
	const value = {
		theme: cookieTheme,
		setTheme: (theme: Theme | undefined) => {
			// Responsively set the theme
			document.documentElement.classList.remove('light', 'dark')

			if (theme) {
				// Set custom theme
				document.documentElement.classList.add(theme)
			} else {
				// When remove custom theme, set system theme
				const systemThem = window.matchMedia('(prefers-color-scheme: dark)')
					.matches
					? 'dark'
					: 'light'
				document.documentElement.classList.add(systemThem)
			}

			// Always revalidate when theme changes to update the cookie
			revalidate()
		},
	}

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext)

	if (context === undefined)
		throw new Error('useTheme must be used within a ThemeProvider')

	return context
}

/**
 * Get custom theme from cookie
 */
export const customThemeCookieName = 'custom-prefers-color-scheme'

export const parsedCustomTheme = (cookieHeader: string) => {
	const parsed = cookieHeader
		.split(';')
		.map(cookie => cookie.trim())
		.find(cookie => cookie.startsWith(`${customThemeCookieName}=`))
		?.split('=')[1]

	if (parsed === 'light' || parsed === 'dark') return parsed

	return undefined
}

export const getCustomTheme = (request: Request): Theme | undefined => {
	const cookieHeader = request.headers.get('Cookie')

	if (!cookieHeader) return undefined
	return parsedCustomTheme(cookieHeader)
}

/**
 * Set custom theme to cookie
 */
export const setCustomTheme = (theme: Theme | undefined) => {
	if (theme === undefined) {
		return (document.cookie = `${customThemeCookieName}=; Max-Age=0; Path=/`)
	}
	document.cookie = `${customThemeCookieName}=${theme}; Max-Age=31536000; Path=/`
}
