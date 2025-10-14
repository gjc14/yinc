import { useEffect } from 'react'
import { useFetcher } from 'react-router'

import { useAtom } from 'jotai'

import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import {
	brandsAtom,
	categoriesAtom,
	tagsAtom,
} from '~/routes/services/ecommerce/store/product/context'

import type { loader as bLoader } from '../../03_brands/route'
import type { loader as cLoader } from '../../04_categories/route'
import type { loader as tLoader } from '../../05_tags/route'

export function Taxonomies() {
	const fetcher = useFetcher<typeof bLoader | typeof cLoader | typeof tLoader>()
	const [tags, setTags] = useAtom(tagsAtom)
	const [categories, setCategories] = useAtom(categoriesAtom)
	const [brands, setBrands] = useAtom(brandsAtom)

	useEffect(() => {
		// Handle taxonomies response
		const data = fetcher.data
		if (!data) return

		if ('tags' in data) {
			setTags(data.tags)
		} else if ('categories' in data) {
			setCategories(data.categories)
		} else if ('brands' in data) {
			setBrands(data.brands)
		}
	}, [fetcher])

	return (
		<>
			<Card className="p-3">
				{categories.length > 0
					? categories.map(cat => <div key={cat.id}>{cat.name}</div>)
					: 'No categories yet'}
				<Button
					onClick={() =>
						fetcher.load('/dashboard/ecommerce/products/categories')
					}
				>
					Load
				</Button>
			</Card>
			<Card className="p-3">
				{tags.length > 0
					? tags.map(tag => <div key={tag.id}>{tag.name}</div>)
					: 'No tags yet'}
				<Button
					onClick={() => fetcher.load('/dashboard/ecommerce/products/tags')}
				>
					Load
				</Button>
			</Card>
			<Card className="p-3">
				{brands.length > 0
					? brands.map(brand => <div key={brand.id}>{brand.name}</div>)
					: 'No brands yet'}
				<Button
					onClick={() => fetcher.load('/dashboard/ecommerce/products/brands')}
				>
					Load
				</Button>
			</Card>
		</>
	)
}
