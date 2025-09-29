import type { Route } from './+types/route'
import { Outlet } from 'react-router'

export default function ECProductsLayout({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	// Load some context data here if needed
	return <Outlet />
}
