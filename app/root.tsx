import './app.css'

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
import { Toaster } from 'sonner'

import { FloatingToolkit } from './components/floating-toolkit'
import { GlobalLoading } from './components/global-loading'

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
				<ThemeProvider>
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
