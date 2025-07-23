import type { Route } from './+types/layout'
import { Outlet } from 'react-router'

import { Provider } from 'jotai'

import { getPosts } from '~/lib/db/post.server'
import { getCategories, getTags } from '~/lib/db/taxonomy.server'

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

let cache: Awaited<ReturnType<typeof loader>>
export const clientLoader = async ({
	serverLoader,
}: Route.ClientLoaderArgs) => {
	if (cache) {
		return cache
	}

	cache = await serverLoader()
	return cache
}

clientLoader.hydrate = true

export default function DashboardBlog() {
	return (
		<Provider>
			<Outlet />
		</Provider>
	)
}
