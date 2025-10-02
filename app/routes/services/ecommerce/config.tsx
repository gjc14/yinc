import { Apple, BadgeDollarSign, Handshake, Package, Store } from 'lucide-react'

import type { Service } from '../../papa/utils/service-configs'

export const config = {
	dashboard: {
		name: 'E-Commerce',
		description: 'Design your storefront with website design AI in React!',
		logo: Store,
		pathname: '/dashboard/ecommerce',
		sidebar: [
			{
				icon: Store,
				title: 'Dashboard',
				pathname: 'ecommerce',
			},
			{
				icon: Handshake,
				title: 'Orders',
				pathname: 'ecommerce/orders',
			},
			{
				icon: Apple,
				title: 'Products',
				pathname: 'ecommerce/products',
				sub: [
					{
						title: 'Create Product',
						pathname: 'new',
					},
					{
						title: 'Brands',
						pathname: 'brands',
					},
					{
						title: 'Categories',
						pathname: 'categories',
					},
					{
						title: 'Tags',
						pathname: 'tags',
					},
					{
						title: 'Attributes',
						pathname: 'attributes',
					},
					{
						title: 'Reviews',
						pathname: 'reviews',
					},
				],
			},
			{
				icon: Package,
				title: 'Inventory',
				pathname: 'ecommerce/inventory',
			},
			{
				icon: BadgeDollarSign,
				title: 'Promotions',
				pathname: 'ecommerce/promotions',
			},
		],
		routes: ({ route, index }) => [
			route('ecommerce', './routes/services/ecommerce/dashboard/layout.tsx', [
				index('./routes/services/ecommerce/dashboard/01_overview/route.tsx'),
				route(
					'products',
					'./routes/services/ecommerce/dashboard/02_products/layout/route.tsx',
					[
						index(
							'./routes/services/ecommerce/dashboard/02_products/01_index/route.tsx',
						),
						route(
							':productId',
							'./routes/services/ecommerce/dashboard/02_products/02_product/route.tsx',
						),
						route(
							'brands',
							'./routes/services/ecommerce/dashboard/02_products/03_brands/route.tsx',
						),
						route(
							'categories',
							'./routes/services/ecommerce/dashboard/02_products/04_categories/route.tsx',
						),
						route(
							'tags',
							'./routes/services/ecommerce/dashboard/02_products/05_tags/route.tsx',
						),
						route(
							'attributes',
							'./routes/services/ecommerce/dashboard/02_products/06_attributes/route.tsx',
						),
						route(
							'reviews',
							'./routes/services/ecommerce/dashboard/02_products/07_reviews/route.tsx',
						),
					],
				),
			]),
		],
	},
	routes: ({ route, index }) => [
		route('/store', './routes/services/ecommerce/store/layout/route.tsx', [
			index('./routes/services/ecommerce/store/index/route.tsx'),
			route(
				'product/:productId',
				'./routes/services/ecommerce/store/product/route.tsx',
			),
		]),
	],
	sitemap: url => [
		{
			loc: `${url.origin}/store`,
			lastmod: new Date(),
			changefreq: 'daily',
			priority: 0.8,
		},
		{
			loc: '/store/123',
			lastmod: new Date(),
			changefreq: 'weekly',
			priority: 0.5,
		},
	],
} satisfies Service
