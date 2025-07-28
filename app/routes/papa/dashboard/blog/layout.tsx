import type { Route } from './+types/layout'
import { Outlet } from 'react-router'

import { Provider } from 'jotai'

import { getPosts } from '~/lib/db/post.server'
import { getCategories, getTags } from '~/lib/db/taxonomy.server'

import { getCache, setCache } from './layout-cache'

export const loader = async () => {
	try {
		console.time('blog-loader')
		// TODO: Post fetching should be optimized
		const [postsData, tagsData, categoriesData] = await Promise.all([
			getPosts({ status: 'ALL' }),
			getTags(),
			getCategories(),
		])
		console.timeEnd('blog-loader')
		return {
			posts: postsData.posts,
			tags: tagsData.tags,
			categories: categoriesData.categories,
		}
	} catch (error) {
		console.error(error)
		return { posts: [], categories: [], tags: [] }
	}
}

export const clientLoader = async ({
	serverLoader,
}: Route.ClientLoaderArgs) => {
	const cache = getCache()
	if (cache) {
		process.env.NODE_ENV === 'development' && console.log('Cache hit')
		return cache
	}

	process.env.NODE_ENV === 'development' && console.log('Cache miss')

	const data = await serverLoader()
	setCache(data)
	return data
}

clientLoader.hydrate = true

export default function DashboardBlog() {
	return (
		<Provider>
			<Outlet />
		</Provider>
	)
}
