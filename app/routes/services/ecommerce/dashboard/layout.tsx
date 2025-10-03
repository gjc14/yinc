import type { Route } from './+types/layout'
import { Outlet } from 'react-router'

import { Provider } from 'jotai'

export default function ECLayout({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return (
		<Provider>
			<Outlet />
		</Provider>
	)
}
