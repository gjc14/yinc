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

import type { action as bAction } from '../../03_brands/resource'
import type { loader as bLoader } from '../../03_brands/route'
import type { action as cAction } from '../../04_categories/resource'
import type { loader as cLoader } from '../../04_categories/route'
import type { action as tAction } from '../../05_tags/resource'
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
		children: [],
	}
}

export function Taxonomies() {
	const cFetcher = useFetcher<typeof cLoader>()
	const tFetcher = useFetcher<typeof tLoader>()
	const bFetcher = useFetcher<typeof bLoader>()

	const cCreateFetcher = useFetcher<typeof cAction>()
	const tCreateFetcher = useFetcher<typeof tAction>()
	const bCreateFetcher = useFetcher<typeof bAction>()

	const [product, setProduct] = useAtom(productAtom)
	const [categories, setCategories] = useAtom(categoriesAtom)
	const [tags, setTags] = useAtom(tagsAtom)
	const [brands, setBrands] = useAtom(brandsAtom)

	const [cPending, setCPending] = useState<typeof categories>([])
	const [tPending, setTPending] = useState<typeof tags>([])
	const [bPending, setBPending] = useState<typeof brands>([])

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
	}, [cFetcher.data, tFetcher.data, bFetcher.data])

	// Handle category creation
	useEffect(() => {
		if (
			cCreateFetcher.state === 'loading' &&
			cCreateFetcher.data &&
			'data' in cCreateFetcher.data &&
			cCreateFetcher.data.data
		) {
			const createdCategory = cCreateFetcher.data.data

			setCPending(prev => prev.filter(c => c.slug !== createdCategory.slug))
			setCategories(prev => [...prev, { ...createdCategory, children: [] }])
			setProduct(prev =>
				prev
					? { ...prev, categories: [...prev.categories, createdCategory] }
					: prev,
			)
		}
	}, [cCreateFetcher.state, cCreateFetcher.data])

	// Handle tag creation
	useEffect(() => {
		if (
			tCreateFetcher.state === 'loading' &&
			tCreateFetcher.data &&
			'data' in tCreateFetcher.data &&
			tCreateFetcher.data.data
		) {
			const createdTag = tCreateFetcher.data.data

			setTPending(prev => prev.filter(t => t.slug !== createdTag.slug))
			setTags(prev => [...prev, createdTag])
			setProduct(prev =>
				prev ? { ...prev, tags: [...prev.tags, createdTag] } : prev,
			)
		}
	}, [tCreateFetcher.state, tCreateFetcher.data])

	// Handle brand creation
	useEffect(() => {
		if (
			bCreateFetcher.state === 'loading' &&
			bCreateFetcher.data &&
			'data' in bCreateFetcher.data &&
			bCreateFetcher.data.data
		) {
			const createdBrand = bCreateFetcher.data.data

			setBPending(prev => prev.filter(b => b.slug !== createdBrand.slug))
			setBrands(prev => [...prev, { ...createdBrand, children: [] }])
			setProduct(prev =>
				prev ? { ...prev, brands: [...prev.brands, createdBrand] } : prev,
			)
		}
	}, [bCreateFetcher.state, bCreateFetcher.data])

	// Auto-submit pending items
	useEffect(() => {
		if (cPending.length > 0 && cCreateFetcher.state === 'idle') {
			const [first] = cPending
			cCreateFetcher.submit(
				{ name: first.name, slug: first.slug },
				{
					method: 'post',
					action: '/dashboard/ecommerce/products/categories/resource',
					encType: 'application/json',
				},
			)
		}
	}, [cPending, cCreateFetcher.state])

	useEffect(() => {
		if (tPending.length > 0 && tCreateFetcher.state === 'idle') {
			const [first] = tPending
			tCreateFetcher.submit(
				{ name: first.name, slug: first.slug },
				{
					method: 'post',
					action: '/dashboard/ecommerce/products/tags/resource',
					encType: 'application/json',
				},
			)
		}
	}, [tPending, tCreateFetcher.state])

	useEffect(() => {
		if (bPending.length > 0 && bCreateFetcher.state === 'idle') {
			const [first] = bPending
			bCreateFetcher.submit(
				{ name: first.name, slug: first.slug },
				{
					method: 'post',
					action: '/dashboard/ecommerce/products/brands/resource',
					encType: 'application/json',
				},
			)
		}
	}, [bPending, bCreateFetcher.state])

	const cSelected = product
		? [
				...product.categories.map(c => ({
					label: c.name,
					value: String(c.id),
				})),
				...cPending.map(c => ({
					label: c.name,
					value: c.name,
					className: c.id > 0 ? '' : 'opacity-50',
				})),
			]
		: []

	const tSelected = product
		? [
				...product.tags.map(t => ({
					label: t.name,
					value: String(t.id),
				})),
				...tPending.map(t => ({
					label: t.name,
					value: t.name,
					className: t.id > 0 ? '' : 'opacity-50',
				})),
			]
		: []

	const bSelected = product
		? [
				...product.brands.map(b => ({
					label: b.name,
					value: String(b.id),
				})),
				...bPending.map(b => ({
					label: b.name,
					value: b.name,
					className: b.id > 0 ? '' : 'opacity-50',
				})),
			]
		: []

	return (
		<>
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
							selected={cSelected}
							onSelectedChange={areSelected => {
								const { existing, notExisting } = areSelected.reduce(
									(acc, selected) => {
										const found = categories.find(
											c => String(c.id) === selected.value,
										)
										if (found) {
											acc.existing.push(found)
										} else {
											acc.notExisting.push(generateTaxonomy(selected.label))
										}
										return acc
									},
									{
										existing: [] as typeof categories,
										notExisting: [] as typeof categories,
									},
								)

								setProduct(prev =>
									prev ? { ...prev, categories: existing } : prev,
								)
								setCPending(notExisting)
							}}
							onInitSearch={() =>
								!dataInitialized.categories &&
								cFetcher.load('/dashboard/ecommerce/products/categories')
							}
							isSearching={!dataInitialized.categories}
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
							selected={tSelected}
							onSelectedChange={areSelected => {
								const { existing, notExisting } = areSelected.reduce(
									(acc, selected) => {
										const found = tags.find(
											t => String(t.id) === selected.value,
										)
										if (found) {
											acc.existing.push(found)
										} else {
											acc.notExisting.push(generateTaxonomy(selected.label))
										}
										return acc
									},
									{
										existing: [] as typeof tags,
										notExisting: [] as typeof tags,
									},
								)

								setProduct(prev => (prev ? { ...prev, tags: existing } : prev))
								setTPending(notExisting)
							}}
							onInitSearch={() =>
								!dataInitialized.tags &&
								tFetcher.load('/dashboard/ecommerce/products/tags')
							}
							isSearching={!dataInitialized.tags}
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
							selected={bSelected}
							onSelectedChange={areSelected => {
								const { existing, notExisting } = areSelected.reduce(
									(acc, selected) => {
										const found = brands.find(
											b => String(b.id) === selected.value,
										)
										if (found) {
											acc.existing.push(found)
										} else {
											acc.notExisting.push(generateTaxonomy(selected.label))
										}
										return acc
									},
									{
										existing: [] as typeof brands,
										notExisting: [] as typeof brands,
									},
								)

								setProduct(prev =>
									prev ? { ...prev, brands: existing } : prev,
								)
								setBPending(notExisting)
							}}
							onInitSearch={() =>
								!dataInitialized.brands &&
								bFetcher.load('/dashboard/ecommerce/products/brands')
							}
							isSearching={!dataInitialized.brands}
						/>
					)}
				</CardContent>
			</Card>
		</>
	)
}
