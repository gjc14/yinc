import './app.css'

import * as crypto from 'node:crypto'
import type { Route } from './+types/root'
import {
	data,
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteError,
	useRouteLoaderData,
} from 'react-router'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

import { FloatingToolkit } from './components/floating-toolkit'
import { GlobalLoading } from './components/global-loading'

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

export function headers({ loaderHeaders }: Route.HeadersArgs) {
	return loaderHeaders
}

export const loader = () => {
	const scriptNonce = crypto.randomUUID()

	/**
	 * @see https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
	 * TODO: script-src & style-src best practice
	 */
	const headers = {
		/** @see https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html */
		'Content-Security-Policy': [
			"default-src 'self'",
			`script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com`,
			`style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
			"font-src 'self' https://fonts.gstatic.com",
			"img-src 'self' data: https://images.unsplash.com https://placecats.com",
			"frame-ancestors 'none'",
			"form-action 'self'",
		].join('; '),
		/** @see https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html */
		'Strict-Transport-Security': 'max-age=3600', // 1 hour. HTTPS only
		'X-Frame-Options': 'SAMEORIGIN', // Prevent clickjacking
		'X-Content-Type-Options': 'nosniff', // Prevent MIME type sniffing
	}

	return data({ scriptNonce }, { headers })
}

/**
 * @see https://reactrouter.com/api/framework-conventions/root.tsx#layout-export
 * Because your <Layout> component is used for rendering the ErrorBoundary,
 * you should be very defensive to ensure that you can render your ErrorBoundary without encountering any render errors.
 */
export function Layout({ children }: { children: React.ReactNode }) {
	const loaderData: unknown = useRouteLoaderData('root')
	const error = useRouteError()

	const scriptNonce =
		!error &&
		loaderData &&
		typeof loaderData === 'object' &&
		'scriptNonce' in loaderData &&
		typeof loaderData.scriptNonce === 'string'
			? loaderData.scriptNonce
			: undefined

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<ThemeProvider nonce={scriptNonce}>
					<GlobalLoading />
					<FloatingToolkit />
					{/* children will be the root Component, ErrorBoundary, or HydrateFallback */}
					{children}
				</ThemeProvider>
				<ScrollRestoration nonce={scriptNonce} />
				<Scripts nonce={scriptNonce} />
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
