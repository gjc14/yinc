import { useEffect, useRef } from 'react'
import { useFetchers, type FetcherWithComponents } from 'react-router'

import { toast, type ExternalToast } from '@gjc14/sonner'

type ServerNotificationResponse = {
	msg?: string
	err?: string
}

/** Function to check if fetchers have response that satisfies auto notification */
export function useServerNotification() {
	const fetchers = useFetchers()
	// Prevent duplicate notifications from same fetcher when re-render. e.g. navigate()
	const processedFetchersRef = useRef<Set<string>>(new Set())

	useEffect(() => {
		fetchers.forEach(fetcher => {
			const fetcherKey = fetcher.key
			if (processedFetchersRef.current.has(fetcherKey)) {
				return console.log('already processed', fetcherKey)
			}

			if (fetcher.data) {
				if (fetcher.data.preventNotification) return
				if (fetcher.data.msg) {
					toast.success(fetcher.data.msg)
				} else if (fetcher.data.err) {
					toast.error(fetcher.data.err)
				}

				processedFetchersRef.current.add(fetcherKey)
			}
		})
	}, [fetchers])
}

/**
 *
 * @param fetcher Fetcher that needed notification
 * @param onSuccess
 * @param onError
 * @param options
 */
export function useFetcherNotification(
	fetcher: FetcherWithComponents<ServerNotificationResponse>,
	onSuccess?: (msg?: string) => void,
	onError?: (err?: string) => void,
	options?: {
		successMessage?: string
		errorMessage?: string
	} & ExternalToast,
) {
	useEffect(() => {
		if (fetcher.data) {
			if (fetcher.data.msg) {
				toast.success(options?.successMessage || fetcher.data.msg, options)
				onSuccess?.(fetcher.data.msg)
			} else if (fetcher.data.err) {
				toast.error(options?.errorMessage || fetcher.data.err, options)
				onError?.(fetcher.data.err)
			}
		}
	}, [fetcher.data])
}
