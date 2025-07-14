import { useCallback } from 'react'

type Start = 'top left' | 'bottom left' | 'top right' | 'bottom right'
type Variant = 'circle' | 'circle-blur'

const maskMap: Record<
	Start,
	{ cx: string; cy: string; origin: string; pos: string }
> = {
	'top left': { cx: '0', cy: '0', origin: 'top left', pos: 'top left' },
	'top right': { cx: '40', cy: '0', origin: 'top right', pos: 'top right' },
	'bottom left': {
		cx: '0',
		cy: '40',
		origin: 'bottom left',
		pos: 'bottom left',
	},
	'bottom right': {
		cx: '40',
		cy: '40',
		origin: 'bottom right',
		pos: 'bottom right',
	},
}

const maskSvg = (variant: Variant, cx: string, cy: string) => {
	switch (variant) {
		case 'circle':
			return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="${cx}" cy="${cy}" r="18" fill="white"/></svg>')`
		case 'circle-blur':
			return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="${cx}" cy="${cy}" r="18" fill="white" filter="url(%23blur)"/></svg>')`
		default:
			return ''
	}
}

const keyframes = (variant: Variant) => {
	switch (variant) {
		case 'circle':
		case 'circle-blur':
			return `
			@keyframes scale {
			to {
				mask-size: 350vmax;
			}
		`
		default:
			return ''
	}
}

export interface ViewTransitionThemeOptions {
	start?: Start
	variant?: Variant
	duration?: number
}

export const useViewTransitionTheme = (
	options: ViewTransitionThemeOptions = {},
) => {
	const { start = 'top left', variant = 'circle', duration = 0.8 } = options

	const { cx, cy, origin, pos } = maskMap[start]
	const mask = maskSvg(variant, cx, cy)
	const kf = keyframes(variant)

	const styles = `
		::view-transition-group(root) {
			animation-timing-function: var(--expo-out);
		}

		::view-transition-new(root) {
			mask: ${mask} ${pos} / 0 no-repeat;
			mask-origin: content-box;
			animation: scale ${duration}s;
			transform-origin: ${origin};
		}

		::view-transition-old(root),
			[data-theme="dark"]::view-transition-old(root) {
			animation: scale ${duration}s;
			transform-origin: ${origin};
			z-index: -1;
		}

		${kf}
	`

	const transition = useCallback((callback: () => void) => {
		if (!document.startViewTransition) {
			callback()
			return
		}
		document.startViewTransition(callback)
	}, [])

	return { styles, transition }
}
