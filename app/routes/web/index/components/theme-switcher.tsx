import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
	getViewTransitionStyles,
	type ViewTransitionThemeOptions,
} from '~/components/theme-toggle'
import { useHydrated } from '~/hooks/use-hydrated'
import { useNonce } from '~/hooks/use-nonce'
import { useViewTransition } from '~/hooks/use-view-transition'

export function ThemeSwitcher(props: ViewTransitionThemeOptions) {
	const isHydrated = useHydrated()
	const nonce = useNonce()
	const { setTheme, theme } = useTheme()
	const { startViewTransition } = useViewTransition()

	const { styles } = getViewTransitionStyles(props)

	const switchTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	const safeNonce = isHydrated ? nonce : undefined

	return (
		<button
			onClick={() => startViewTransition(switchTheme)}
			{...props}
			className="border-primary/80 bg-brand/30 mt-6 size-11 border-2 p-0 transition-transform"
		>
			{safeNonce && <style nonce={safeNonce}>{styles}</style>}
			<Sun className="stroke-foreground hidden size-6 dark:inline" />
			<Moon className="stroke-foreground inline size-6 dark:hidden" />
			<span className="sr-only">Toggle theme</span>
		</button>
	)
}
