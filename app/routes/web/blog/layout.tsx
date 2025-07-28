import type { Route } from './+types/layout'
import { useEffect, useState } from 'react'
import { Outlet, useNavigation } from 'react-router'

import { getPostBySlug, getPosts } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'
import { validateAdminSession } from '~/routes/papa/auth/utils'

import { BlogLoading } from './components/blog-loading'
import { CTA } from './components/cta'
import { Footer } from './components/footer'
import { Nav } from './components/nav'
import { getCache, setCache } from './layout-cache'

export const meta = ({ data, location }: Route.MetaArgs) => {
	if (!data || !data.meta) {
		if (location.pathname !== '/blog') {
			return [{ name: 'title', content: 'Post - Not Found' }]
		}
		return []
	}

	return data.meta.metaTags
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const url = new URL(request.url)

	const { seo } = await getSEO(url.pathname) // /blog or /blog/:slug
	const meta = seo ? createMeta(seo, url) : null

	const { searchParams } = url
	const preview = searchParams.get('preview') === 'true'
	if (preview) {
		validateAdminSession(request)
	}

	const { postSlug } = params

	const categories = url.searchParams.get('category')?.split(',')
	const tags = url.searchParams.get('tag')?.split(',')

	if (postSlug) {
		process.env.NODE_ENV === 'development' && console.time('getPosts:single')
		// Enter directly to a post
		const { post } = await getPostBySlug(
			postSlug,
			preview ? 'DRAFT' : 'PUBLISHED',
		)
		process.env.NODE_ENV === 'development' && console.timeEnd('getPosts:single')
		return {
			searchParams: searchParams.toString(),
			meta,
			posts: post ? [post] : [],
		}
	} else {
		process.env.NODE_ENV === 'development' && console.time('getPosts:many')
		const { posts, categoriesFilter, tagsFilter } = await getPosts({
			status: 'PUBLISHED',
			categoriesFilter: categories,
			tagsFilter: tags,
		})
		process.env.NODE_ENV === 'development' && console.timeEnd('getPosts:many')
		return {
			searchParams: searchParams.toString(),
			meta,
			posts,
			categoriesFilter,
			tagsFilter,
		}
	}
}

export const clientLoader = async ({
	request,
	params,
	serverLoader,
}: Route.ClientLoaderArgs) => {
	const cache = getCache()
	if (cache) {
		if (cache.searchParams === new URL(request.url).searchParams.toString()) {
			return cache
		}
	}

	const data = await serverLoader()
	if (!params.postSlug) setCache(data)
	return data
}

clientLoader.hydrate = true

export default function Blog() {
	const navigation = useNavigation()
	const isLoading = navigation.state === 'loading'

	const [showLoading, setShowLoading] = useState(false)

	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		if (isLoading) {
			timeoutId = setTimeout(() => {
				setShowLoading(true)
			}, 30)
		} else {
			setShowLoading(false)
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	}, [isLoading])

	return (
		<div className="relative">
			<main className="relative flex min-h-svh w-full flex-1 flex-col">
				<Nav />
				<Outlet />
				<CTA />
				<Footer />
			</main>

			{isLoading && showLoading && (
				<>
					<div className="fixed inset-0 z-10 bg-black/50" />
					<BlogLoading />
				</>
			)}
		</div>
	)
}
