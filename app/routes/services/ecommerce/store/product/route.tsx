import type { Route } from './+types/route'
import { Link } from 'react-router'

import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

import { products } from '../data'

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const productId = params.productId
	const product = products.find(p => p.id === productId)

	if (!product) {
		throw new Response('Product not found', { status: 404 })
	}

	return { product }
}

export default function ProductPage({ loaderData }: Route.ComponentProps) {
	const { product } = loaderData

	return (
		<div className="mx-auto max-w-2xl">
			<Card>
				<CardContent className="p-8 text-center">
					<div className="mb-6 text-8xl">{product.image}</div>
					<h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
					<p className="mb-6 text-gray-600">{product.description}</p>
					<p className="mb-8 text-3xl font-bold text-blue-600">
						NT$ {product.price.toLocaleString()}
					</p>

					<div className="space-y-4">
						<Button size="lg" className="w-full">
							Add to Cart
						</Button>
						<Button variant="outline" size="lg" asChild className="w-full">
							<Link to="/store">← Back to Shop</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
