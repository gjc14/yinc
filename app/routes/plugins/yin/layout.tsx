import { Outlet } from 'react-router'

export default function Layout() {
	return (
		<div>
			<nav>
				<ul>
					<li>
						<a href="/">/</a>
					</li>
					<li>
						<a href="/blog">Blog</a>
					</li>
				</ul>
			</nav>
			<Outlet />
		</div>
	)
}
