import {
	isRouteErrorResponse,
	Link,
	Outlet,
	useRouteError,
	type MetaFunction,
} from 'react-router'

import { AlertCircle, ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '~/components/ui/button'
import { fade } from '~/components/motions'
import { statusCodeMap } from '~/lib/utils/status-code'

export const meta: MetaFunction = ({ error }) => {
	if (isRouteErrorResponse(error)) {
		const statusMessage = statusCodeMap[error.status]
		const errorMessage = error.data || statusMessage.text || 'Error Response'
		return [
			{
				title: `${error.status} - ${errorMessage}`,
			},
			{
				name: 'description',
				content: statusMessage?.description || 'Route Error Response',
			},
		]
	} else {
		return [
			{ title: 'Error' },
			{
				name: 'description',
				content: 'An unexpected error occurred.',
			},
		]
	}
}

export default function Web() {
	return <Outlet />
}

export function ErrorBoundary() {
	const error = useRouteError()

	// Route throw new Response (404, etc.)
	if (isRouteErrorResponse(error)) {
		console.error('Route Error Response:', error)

		switch (error.status) {
			case 404:
				return (
					<main className="w-screen h-svh flex flex-col items-center justify-center">
						<motion.h1
							className="mb-2 text-[8rem] leading-none tracking-tight sm:text-[10rem] md:text-[15rem]"
							{...fade()}
						>
							404
						</motion.h1>

						<h2 className="mb-8 text-2xl font-semibold md:text-3xl">
							Page Not Found
						</h2>

						<p className="mb-8 mx-3 max-w-md text-lg text-primary/80 text-center text-pretty">
							Sorry, we couldn’t find the page you’re looking for.
						</p>

						<Link to={'/'}>
							<Button variant={'link'}>
								<ArrowLeft /> Back to Home
							</Button>
						</Link>
					</main>
				)
			default: {
				const statusMessage = statusCodeMap[error.status]
				const errorMessage =
					error.data || statusMessage.text || 'Error Response'

				return (
					<main className="w-screen h-svh flex flex-col items-center justify-center">
						<a
							className="z-10 text-sm underline underline-offset-4"
							href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${error.status}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							Why am I seeing this error?
						</a>

						<motion.h1
							className="mb-2 text-[8rem] leading-none tracking-tight sm:text-[10rem] md:text-[15rem]"
							{...fade()}
						>
							{error.status}
						</motion.h1>

						{errorMessage && (
							<h2 className="mb-8 text-2xl font-semibold md:text-3xl">
								{errorMessage}
							</h2>
						)}

						<Link to={'/'}>
							<Button variant={'outline'} className="rounded-full">
								<ArrowLeft /> Back to Home
							</Button>
						</Link>
					</main>
				)
			}
		}
	} else if (error instanceof Error) {
		// throw new Error('message')
		console.error('Error:', error)

		return (
			<main className="w-screen h-svh flex flex-col items-center justify-center">
				<motion.h1
					className="mb-2 text-[8rem] leading-none tracking-tight sm:text-[10rem] md:text-[15rem]"
					{...fade()}
				>
					500
				</motion.h1>

				<h2 className="mb-8 text-2xl font-semibold md:text-3xl">
					Internal Server Error
				</h2>

				<p className="mb-8 mx-3 max-w-md text-lg text-primary/80 text-center text-pretty">
					Something went wrong on our servers.
				</p>

				<div className="flex flex-col sm:flex-row gap-4">
					<Link to={'/'}>
						<Button variant="outline" className="rounded-full">
							<ArrowLeft className="w-4 h-4" /> Back to Home
						</Button>
					</Link>

					<a href="mailto:contact@ema.il">
						<Button variant="secondary" className="rounded-full">
							<AlertCircle />
							Report this error
						</Button>
					</a>
				</div>
			</main>
		)
	}

	console.error('Unknown Error:', error)

	return (
		// Unknown error
		<main className="w-screen h-svh flex flex-col items-center justify-center">
			<motion.h1
				className="mb-2 text-[8rem] leading-none tracking-tight sm:text-[10rem] md:text-[15rem]"
				{...fade()}
			>
				XXX
			</motion.h1>

			<h2 className="mb-8 text-2xl font-semibold md:text-3xl">Unknown Error</h2>

			<p className="mb-8 mx-3 max-w-md text-lg text-primary/80 text-center text-pretty">
				Ops! Something went wrong.
			</p>

			<div className="flex flex-col sm:flex-row gap-4">
				<Link to={'/'}>
					<Button variant="outline" className="rounded-full">
						<ArrowLeft className="w-4 h-4" /> Back to Home
					</Button>
				</Link>

				<a href="mailto:contact@ema.il">
					<Button variant="secondary" className="rounded-full">
						<AlertCircle />
						Report this error
					</Button>
				</a>
			</div>
		</main>
	)
}
