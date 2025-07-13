import { NavLink } from 'react-router'

import { ThemeToggle } from '~/components/theme-toggle'

export const Nav = () => {
	return (
		<nav className="mb-6 flex w-full items-center justify-end gap-2 p-2 md:mb-8">
			<NavLink
				to="/"
				className="flex items-center gap-2 text-sm underline-offset-4 hover:underline"
				aria-label="go to home /"
			>
				Home
			</NavLink>
			<ThemeToggle className="rounded-full border-0 p-0" />
		</nav>
	)
}
