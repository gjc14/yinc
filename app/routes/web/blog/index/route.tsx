import type { Route } from './+types/route'
import { Link } from 'react-router'

import { Badge } from '~/components/ui/badge'

import { PostCollection } from '../components/posts'

export default function Index({ matches }: Route.ComponentProps) {
	const { meta, posts, categoriesFilter, tagsFilter } = matches[2].data

	const isCategoryFiltering = categoriesFilter && categoriesFilter.length > 0
	const isTagFiltering = tagsFilter && tagsFilter.length > 0

	const categoryFilters = isCategoryFiltering ? (
		<span className="space-x-1">
			category:{' '}
			{categoriesFilter.map(cat => (
				<Link key={cat.id} to={`/blog?category=${cat.slug}`}>
					<Badge className="bg-brand text-brand-foreground rounded-full">
						{cat.name}
					</Badge>
				</Link>
			))}
		</span>
	) : undefined

	const tagFilters = isTagFiltering ? (
		<span className="space-x-1">
			tag:{' '}
			{tagsFilter.map(tag => (
				<Link key={tag.id} to={`/blog?tag=${tag.slug}`}>
					<Badge className="bg-brand text-brand-foreground rounded-full">
						{tag.name}
					</Badge>
				</Link>
			))}
		</span>
	) : undefined

	let description: React.ReactNode = undefined

	if (categoryFilters && tagFilters) {
		description = (
			<>
				Filtered by {categoryFilters} | {tagFilters}
			</>
		)
	} else if (categoryFilters) {
		description = <>Filter by {categoryFilters}</>
	} else if (tagFilters) {
		description = <>Filter by {tagFilters}</>
	}

	return (
		<>
			<h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>

			<PostCollection title={'Blog.'} posts={posts} description={description} />
		</>
	)
}
