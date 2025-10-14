import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'

import { useAtom } from 'jotai'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { Spinner } from '~/components/ui/spinner'
import { MultiSelect } from '~/components/multi-select'
import { generateSlug } from '~/lib/utils/seo'
import {
	brandsAtom,
	categoriesAtom,
	productAtom,
	tagsAtom,
} from '~/routes/services/ecommerce/store/product/context'

import type { loader as bLoader } from '../../03_brands/route'
import type { loader as cLoader } from '../../04_categories/route'
import type { loader as tLoader } from '../../05_tags/route'

const generateTaxonomy = (name: string) => {
	const slug = generateSlug(name, { fallbackPrefix: 'new classification' })

	return {
		id: -(Math.floor(Math.random() * 2147483648) + 1),
		name: name,
		slug,
		description: '',
		image: null,
		parentId: null,
	}
}

export function Taxonomies() {
	const cFetcher = useFetcher<typeof cLoader>()
	const tFetcher = useFetcher<typeof tLoader>()
	const bFetcher = useFetcher<typeof bLoader>()
	const [product, setProduct] = useAtom(productAtom)
	const [categories, setCategories] = useAtom(categoriesAtom)
	const [tags, setTags] = useAtom(tagsAtom)
	const [brands, setBrands] = useAtom(brandsAtom)

	const [dataInitialized, setDataInitialized] = useState({
		tags: false,
		categories: false,
		brands: false,
	})

	useEffect(() => {
		// Handle taxonomies response
		const cData = cFetcher.data
		const tData = tFetcher.data
		const bData = bFetcher.data

		if (cData && 'categories' in cData) {
			setCategories(cData.categories)
			setDataInitialized(prev => ({ ...prev, categories: true }))
		}

		if (tData && 'tags' in tData) {
			setTags(tData.tags)
			setDataInitialized(prev => ({ ...prev, tags: true }))
		}

		if (bData && 'brands' in bData) {
			setBrands(bData.brands)
			setDataInitialized(prev => ({ ...prev, brands: true }))
		}
	}, [cFetcher, tFetcher, bFetcher])

	return (
		<>
			<button
				className="w-full rounded-md border py-2"
				onClick={() => {
					!dataInitialized.categories &&
						cFetcher.load('/dashboard/ecommerce/products/categories')
					!dataInitialized.tags &&
						tFetcher.load('/dashboard/ecommerce/products/tags')
					!dataInitialized.brands &&
						bFetcher.load('/dashboard/ecommerce/products/brands')
				}}
			>
				Load
			</button>
			<Card>
				<CardHeader>
					<CardTitle>categories</CardTitle>
					<CardDescription>categories description</CardDescription>
				</CardHeader>
				<CardContent>
					{!product ? (
						<Spinner />
					) : (
						<MultiSelect
							options={categories.map(c => ({
								label: c.name,
								value: String(c.id),
							}))}
							selected={product.categories.map(c => ({
								label: c.name,
								value: String(c.id),
							}))}
							onSelectedChange={areSelected => {
								const newCategories = areSelected.map(selected => {
									const existing = categories.find(
										c => String(c.id) === selected.value,
									)
									return existing ?? generateTaxonomy(selected.label)
								})

								setProduct(prev =>
									prev ? { ...prev, categories: newCategories } : prev,
								)
							}}
						/>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>tags</CardTitle>
					<CardDescription>tags description</CardDescription>
				</CardHeader>
				<CardContent>
					{!product ? (
						<Spinner />
					) : (
						<MultiSelect
							options={tags.map(t => ({
								label: t.name,
								value: String(t.id),
							}))}
							selected={product.tags.map(t => ({
								label: t.name,
								value: String(t.id),
							}))}
							onSelectedChange={areSelected => {
								const newTags = areSelected.map(selected => {
									const existing = tags.find(
										t => String(t.id) === selected.value,
									)
									return existing ?? generateTaxonomy(selected.label)
								})

								setProduct(prev => (prev ? { ...prev, tags: newTags } : prev))
							}}
						/>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>brands</CardTitle>
					<CardDescription>brands description</CardDescription>
				</CardHeader>
				<CardContent>
					{!product ? (
						<Spinner />
					) : (
						<MultiSelect
							options={brands.map(b => ({
								label: b.name,
								value: String(b.id),
							}))}
							selected={product.brands.map(b => ({
								label: b.name,
								value: String(b.id),
							}))}
							onSelectedChange={areSelected => {
								const newBrands = areSelected.map(selected => {
									const existing = brands.find(
										b => String(b.id) === selected.value,
									)
									return existing ?? generateTaxonomy(selected.label)
								})

								setProduct(prev =>
									prev ? { ...prev, brands: newBrands } : prev,
								)
							}}
						/>
					)}
				</CardContent>
			</Card>
		</>
	)
}
