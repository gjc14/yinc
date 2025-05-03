import { isRouteErrorResponse, Link, Outlet, useRouteError } from 'react-router'

import { Settings } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { authClient } from '~/lib/auth/auth-client'

export default function Web() {
	const { data } = authClient.useSession()

	return (
		<>
			{data?.user.role === 'admin' && (
				<Link to={'/admin'} className="z-99999">
					<Button
						variant="ghost"
						size={'icon'}
						className="fixed right-1 bottom-1"
						aria-label="go to admin page"
					>
						<Settings />
					</Button>
				</Link>
			)}
			<Outlet />
		</>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()

	// throw new Response()
	if (isRouteErrorResponse(error)) {
		console.error('Error response:', error.data)
		return (
			<main className="w-screen h-screen flex flex-col items-center justify-center">
				<div className="flex flex-1 flex-col justify-center text-primary">
					<h1 className="text-center font-mono">{error.status}</h1>
					<a
						className="text-center inline-block underline"
						href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${error.status}`}
					>
						why this error?
					</a>
				</div>
			</main>
		)
	} else if (error instanceof Error) {
		// throw new Error('message')
		return (
			<main className="w-screen h-screen flex flex-col items-center justify-center">
				<div className="flex flex-1 flex-col justify-center text-primary">
					<h1 className="text-center font-mono">500</h1>
					<p>Internal Server Error</p>
					<a
						href="mailto:your@ema.il"
						className="text-center inline-block underline"
					>
						Report this error
					</a>
				</div>
			</main>
		)
	}

	return (
		<main className="w-screen h-screen flex flex-col items-center justify-center">
			<div className="flex flex-1 flex-col justify-center text-primary">
				<h1 className="text-center font-mono">Unknown Error</h1>
				<a
					href="mailto:your@ema.il"
					className="text-center inline-block underline"
				>
					Report this error
				</a>
			</div>
		</main>
	)
}
