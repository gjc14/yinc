import { Link } from 'react-router'

import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

import { products } from './data'

export default function Shop() {
	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{products.map(product => (
					<Card key={product.id} className="hover:shadow-lg transition-shadow">
						<CardContent className="p-6 text-center">
							<div className="text-6xl mb-4">{product.image}</div>
							<h3 className="font-medium mb-2">{product.name}</h3>
							<p className="text-lg font-bold text-blue-600 mb-4">
								NT$ {product.price.toLocaleString()}
							</p>
							<Button asChild className="w-full">
								<Link to={`${product.id}`}>View Details</Link>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}