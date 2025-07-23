import './app.css'
import '@gjc14/sonner/dist/styles.css'

import type { Route } from './+types/root'
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteError,
} from 'react-router'

import { ThemeProvider } from 'next-themes'

import { FloatingToolkit } from './components/floating-toolkit'
import { GlobalLoading } from './components/global-loading'
import { Toaster } from './components/ui/sonner'
import { useNonce } from './hooks/use-nonce'
import {
	generateNonce,
	getContentSecurityPolicy,
	nonceContext,
} from './middleware/csp'

const headersMiddleware: Route.unstable_MiddlewareFunction = async (
	{ context, request },
	next,
) => {
	const nonce = generateNonce()

	const headers = {
		[process.env.NODE_ENV === 'production'
			? 'Content-Security-Policy'
			: 'Content-Security-Policy-Report-Only']: getContentSecurityPolicy(nonce),
		/** @see https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security */
		'Strict-Transport-Security': 'max-age=3600', // 1 hour. HTTPS only
		'X-Frame-Options': 'SAMEORIGIN', // Prevent clickjacking
		'X-Content-Type-Options': 'nosniff', // Prevent MIME type sniffing
	}

	context.set(nonceContext, nonce)

	const response = await next()
	for (const [key, value] of Object.entries(headers)) {
		response.headers.set(key, value)
	}

	return response
}

export const unstable_middleware: Route.unstable_MiddlewareFunction[] = [
	headersMiddleware,
]

export function links() {
	return [{ rel: 'icon', href: '/favicon.ico' }]
}

export const meta = ({ error }: Route.MetaArgs) => {
	if (!error) {
		return [
			{ title: 'Papa Open Source CMS' },
			{
				name: 'description',
				content: 'MIT Open Source Personal CMS.',
			},
			{
				name: 'og:title',
				content: 'Papa Open Source CMS',
			},
			{
				name: 'og:description',
				content: 'MIT Open Source Personal CMS.',
			},
			{
				name: 'og:image',
				content: '/papa-logo-100.png',
			},
		]
	}
}

export const loader = ({ context }: Route.LoaderArgs) => {
	return { nonce: context.get(nonceContext) }
}

/**
 * @see https://reactrouter.com/api/framework-conventions/root.tsx#layout-export
 * Because your <Layout> component is used for rendering the ErrorBoundary,
 * you should be very defensive to ensure that you can render your ErrorBoundary without encountering any render errors.
 */
export function Layout({ children }: { children: React.ReactNode }) {
	const nonce = useNonce()

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{
					/** Vite looks for this meta tag to inject the nonce @see https://vite.dev/guide/features.html#nonce-random */
					import.meta.env.DEV && <meta property="csp-nonce" nonce={nonce} />
				}
				<Meta />
				<Links />
			</head>
			<body>
				<ThemeProvider nonce={nonce}>
					<GlobalLoading />
					<FloatingToolkit />
					{/* children will be the root Component, ErrorBoundary, or HydrateFallback */}
					{children}
				</ThemeProvider>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
			</body>
		</html>
	)
}

export default function App() {
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
