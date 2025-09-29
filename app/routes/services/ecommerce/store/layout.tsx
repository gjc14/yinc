import { Link, Outlet } from 'react-router'

import { Button } from '~/components/ui/button'

export default function ShopLayout() {
	return (
		<main className="min-h-svh p-8">
			<div className="mx-auto flex max-w-4xl flex-col items-center gap-2">
				<Link to="/store">
					<h1 className="underline-offset-4 hover:underline">
						🍜 Example Shop
					</h1>
				</Link>

				<Button
					asChild
					variant={'ghost'}
					className="mb-8 border-2 border-dashed"
				>
					<Link to="/dashboard/ecommerce">See Dashboard</Link>
				</Button>
			</div>

			<Outlet />
		</main>
	)
}
