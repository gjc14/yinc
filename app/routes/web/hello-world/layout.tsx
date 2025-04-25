import { Outlet } from 'react-router'

export async function loader() {
	return null
}

export default function Layout() {
	return (
		<main className="h-screen w-screen flex flex-col items-center justify-center border-4 border-primary border-dotted overflow-scroll">
			<p>This content is from layout.tsx file.</p>
			<Outlet />
		</main>
	)
}
