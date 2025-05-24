import { Outlet } from 'react-router'

export default function Layout() {
	return (
		<main className="w-full h-svh bg-brand/35">
			<Outlet />
		</main>
	)
}
