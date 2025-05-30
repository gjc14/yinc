import { Outlet } from 'react-router'

export async function loader() {
	if (process.env.NODE_ENV === 'production') {
		// In production, we might want to redirect or show a different message
		throw new Response('', {
			status: 404,
		})
	}
	return null
}

export default function Layout() {
	return (
		<main className="h-svh w-screen flex flex-col items-center justify-center border-4 border-primary border-dotted overflow-scroll">
			<p>This content is from layout.tsx file.</p>
			<Outlet />
		</main>
	)
}
