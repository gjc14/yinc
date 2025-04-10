import React from 'react'

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param immediate If `true`, trigger the function on the leading edge instead of the trailing edge
 * @returns A debounced version of the original function
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
	immediate: boolean = false,
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null

	return function (this: any, ...args: Parameters<T>): void {
		const context = this

		const later = function () {
			timeout = null
			if (!immediate) func.apply(context, args)
		}

		const callNow = immediate && !timeout

		if (timeout) {
			clearTimeout(timeout)
		}

		timeout = setTimeout(later, wait)

		if (callNow) {
			func.apply(context, args)
		}
	}
}

/**
 * Creates a debounced function with cancellation capabilities
 *
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param immediate If `true`, trigger the function on the leading edge instead of the trailing edge
 * @returns An object with the debounced function and a cancel method
 */
export function debounceCancellable<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
	immediate: boolean = false,
): {
	debounced: (...args: Parameters<T>) => void
	cancel: () => void
} {
	let timeout: ReturnType<typeof setTimeout> | null = null

	function debounced(this: any, ...args: Parameters<T>): void {
		const context = this

		const later = function () {
			timeout = null
			if (!immediate) func.apply(context, args)
		}

		const callNow = immediate && !timeout

		if (timeout) {
			clearTimeout(timeout)
		}

		timeout = setTimeout(later, wait)

		if (callNow) {
			func.apply(context, args)
		}
	}

	function cancel(): void {
		if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
	}

	return { debounced, cancel }
}

/**
 * React hook that returns a debounced version of the provided function
 *
 * @param callback The function to debounce
 * @param delay The number of milliseconds to delay
 * @param deps Dependencies array (similar to useEffect deps)
 * @returns A debounced version of the callback
 */
export function useDebounce<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
	deps: React.DependencyList = [],
): (...args: Parameters<T>) => void {
	const callbackRef = React.useRef<{
		callback: T
		timer: ReturnType<typeof setTimeout> | null
	}>({
		callback,
		timer: null,
	})

	React.useEffect(() => {
		callbackRef.current.callback = callback
	}, [callback])

	React.useEffect(() => {
		return () => {
			if (callbackRef.current.timer) {
				clearTimeout(callbackRef.current.timer)
			}
		}
	}, [])

	return React.useCallback((...args: Parameters<T>) => {
		if (callbackRef.current.timer) {
			clearTimeout(callbackRef.current.timer)
		}

		callbackRef.current.timer = setTimeout(() => {
			callbackRef.current.callback(...args)
		}, delay)
	}, deps)
}
