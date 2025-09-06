import type { Route } from './+types/route'

import { Badge } from '~/components/ui/badge'
import { getPosts } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'

import { PostCollection } from '../components/posts'

export const meta = ({ data }: Route.MetaArgs) => {
	if (!data || !data.meta) {
		return [{ name: 'title', content: 'Blog' }]
	}
	return data.meta.metaTags
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const url = new URL(request.url)

	const { seo } = await getSEO(url.pathname)
	const meta = seo ? createMeta(seo, url) : null

	const { searchParams } = url
	const categories = url.searchParams.get('category')?.split(',')
	const tags = url.searchParams.get('tag')?.split(',')

	process.env.NODE_ENV === 'development' && console.time('getPosts')
	const { posts, categoriesFilter, tagsFilter } = await getPosts({
		status: 'PUBLISHED',
		categories,
		tags,
	})
	process.env.NODE_ENV === 'development' && console.timeEnd('getPosts')
	return {
		searchParams: searchParams.toString(),
		meta,
		posts,
		categoriesFilter,
		tagsFilter,
	}
}

let cache: Awaited<ReturnType<typeof loader>> | null = null

export const clientLoader = async ({
	request,
	serverLoader,
}: Route.ClientLoaderArgs) => {
	if (cache) {
		if (cache.searchParams === new URL(request.url).searchParams.toString()) {
			return cache
		}
	}

	const data = await serverLoader()
	cache = data
	return data
}

clientLoader.hydrate = true

export default function Index({ loaderData }: Route.ComponentProps) {
	const { meta, posts, categoriesFilter, tagsFilter } = loaderData

	const isCategoryFiltering = categoriesFilter && categoriesFilter.length > 0
	const isTagFiltering = tagsFilter && tagsFilter.length > 0

	const categoryFilters = isCategoryFiltering ? (
		<span className="space-x-1">
			category:{' '}
			{categoriesFilter.map(cat => (
				<Badge
					key={cat.id}
					className="border-primary bg-brand text-brand-foreground rounded-full"
				>
					{cat.name}
				</Badge>
			))}
		</span>
	) : undefined

	const tagFilters = isTagFiltering ? (
		<span className="space-x-1">
			tag:{' '}
			{tagsFilter.map(tag => (
				<Badge
					key={tag.id}
					className="border-primary bg-brand text-brand-foreground rounded-full"
				>
					{tag.name}
				</Badge>
			))}
		</span>
	) : undefined

	let description: React.ReactNode = undefined

	if (categoryFilters && tagFilters) {
		description = (
			<>
				{categoryFilters}
				{tagFilters}
			</>
		)
	} else if (categoryFilters) {
		description = <>{categoryFilters}</>
	} else if (tagFilters) {
		description = <>{tagFilters}</>
	}

	return (
		<>
			<h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>

			<PostCollection title={'Blog.'} posts={posts} description={description} />
		</>
	)
}
