import './app.css'

import type { Route } from './+types/root'
import { useEffect, useRef } from 'react'
import {
	data,
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useFetchers,
	useLoaderData,
	useRouteError,
	type LoaderFunctionArgs,
} from 'react-router'

import { ThemeProvider } from 'next-themes'
import { toast, Toaster } from 'sonner'

import { FloatingToolkit } from './components/floating-toolkit'
import { GlobalLoading } from './components/global-loading'
import { commitFlashSession, getFlashSession } from './lib/sessions.server'
import { isConventionalError, isConventionalSuccess } from './lib/utils'

export const meta = ({ error }: Route.MetaArgs) => {
	if (!error) {
		return [
			{ title: 'Papa Open Source CMS' },
			{
				name: 'description',
				content: 'MIT Open Source Personal CMS.',
			},
		]
	}
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<ThemeProvider attribute="class">
					<GlobalLoading />
					<FloatingToolkit />
					{/* children will be the root Component, ErrorBoundary, or HydrateFallback */}
					{children}
				</ThemeProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const flashSession = await getFlashSession(request.headers.get('Cookie'))
	const successes = flashSession.get('success') ?? []
	const errors = flashSession.get('error') ?? []

	if (successes.length === 0 && errors.length === 0) {
		return {
			successes,
			errors,
		}
	}

	return data(
		{
			successes,
			errors,
		},
		{
			headers: {
				'Set-Cookie': await commitFlashSession(flashSession),
			},
		},
	)
}

export default function App() {
	const { successes, errors } = useLoaderData<typeof loader>()
	const fetchers = useFetchers()

	const toastKeysRef = useRef<Map<string, number>>(new Map())
	const prevFetchersRef = useRef(fetchers)

	// Action response handler for front-end submit `useSubmit()` (Like the function of session flash but front-end)
	useEffect(() => {
		if (fetchers.length > 0) {
			const currentTimestamp = Date.now()
			const expiry = 600

			const cleanedKeys = new Map(
				Array.from(toastKeysRef.current.entries()).filter(
					([, timestamp]) => currentTimestamp - timestamp < expiry,
				),
			)

			// Convention: actions return { msg, data? } | { err, data? } refer to README.md or ./app/libs/utils.tsx
			const actionResponses = fetchers.filter(fetcher => {
				return (
					fetcher.state === 'loading' &&
					fetcher.data &&
					!prevFetchersRef.current
						// If fetcher submitted multiple time in a row,
						// the filter will treate it as a new fetcher because it wasn't loading previously.
						// This mainly to prevent multiple toasts for different fetchers in a row.
						// Which causes one fetcher to be included in multiple fetchers effect,
						// when other fetcher triggers loading while the one fetcher hasn't finish loading.
						.filter(fetcher => fetcher.state === 'loading')
						.map(fetcher => fetcher.key)
						.includes(fetcher.key)
				)
			})

			const successResponses = actionResponses.filter(
				fetcher => fetcher.data.msg && !cleanedKeys.has(fetcher.key),
			)
			const errorResponses = actionResponses.filter(
				fetcher => fetcher.data.err && !cleanedKeys.has(fetcher.key),
			)

			successResponses.forEach(fetcher => {
				if (isConventionalSuccess(fetcher.data)) {
					!fetcher.data.options?.preventAlert && toast.success(fetcher.data.msg)
				} else {
					console.warn('Your action response is not a conventional success')
				}
				cleanedKeys.set(fetcher.key, currentTimestamp)
			})
			errorResponses.forEach(fetcher => {
				if (isConventionalError(fetcher.data)) {
					console.error(fetcher.data.err)
					!fetcher.data.options?.preventAlert && toast.error(fetcher.data.err)
				} else {
					console.warn('Your action response is not a conventional error')
				}
				cleanedKeys.set(fetcher.key, currentTimestamp)
			})

			toastKeysRef.current = cleanedKeys
			prevFetchersRef.current = fetchers
		}
	}, [fetchers])

	useEffect(() => {
		if (successes.length > 0) {
			toast.success(successes)
		}

		if (errors.length > 0) {
			toast.error(errors)
		}
	}, [successes, errors])

	return (
		<>
			<Toaster
				position="top-right"
				closeButton
				toastOptions={{
					classNames: {
						closeButton: 'border border-primary',
					},
				}}
				className="z-99999"
			/>
			<Outlet />
		</>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()

	// Route throw new Response (404, etc.)
	if (isRouteErrorResponse(error)) {
		console.error('Root Route Error Response:', error)

		return (
			<main className="flex h-svh w-screen flex-col items-center justify-center">
				<p>Root Error Boundary.</p>
				<p>
					Server Response <strong>{error.status}</strong>
				</p>
			</main>
		)
	} else if (error instanceof Error) {
		// throw new Error('message')
		console.error('Error:', error)

		return (
			<main className="flex h-svh w-screen flex-col items-center justify-center">
				<p>Root Error Boundary.</p>
				<p>
					Error <strong>{error.message}</strong>
				</p>
			</main>
		)
	}

	console.error('Unknown Error:', error)

	return (
		// Unknown error
		<main className="flex h-svh w-screen flex-col items-center justify-center">
			<p>Root Error Boundary.</p>
			<p>Unknown Error</p>
		</main>
	)
}
