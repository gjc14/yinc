import { Outlet } from 'react-router'

import { getPosts } from '~/lib/db/post.server'
import { getCategories, getTags } from '~/lib/db/taxonomy.server'

export const loader = async () => {
	try {
		const { posts } = await getPosts({ status: 'ALL' })
		const { tags } = await getTags()
		const { categories } = await getCategories()
		return { posts, tags, categories }
	} catch (error) {
		console.error(error)
		return { posts: [], categories: [], tags: [] }
	}
}

export default function DashboardBlog() {
	return <Outlet />
}
