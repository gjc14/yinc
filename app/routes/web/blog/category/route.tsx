import {
	useLoaderData,
	type LoaderFunctionArgs,
	type MetaFunction,
} from 'react-router'

import { getPosts } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'

import { SectionWrapper } from '../components/max-width-wrapper'
import { PostCollection } from '../components/posts'

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
	if (!data || !data.meta) {
		return []
	}

	return data.meta.metaTags
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const { seo } = await getSEO(url.pathname)
	const meta = seo ? createMeta(seo, url) : null
	const slug = url.searchParams.get('q')
	if (!slug) return { meta, posts: [] }

	try {
		const { posts, categoriesFilter } = await getPosts({
			status: 'PUBLISHED',
			categoriesFilter: [slug],
		})
		return { meta, posts, categoriesFilter }
	} catch (error) {
		console.error(error)
		return { meta, posts: [] }
	}
}

export default function Category() {
	const { meta, posts, categoriesFilter } = useLoaderData<typeof loader>()

	const catNames = categoriesFilter?.map(cat => cat.name)

	return (
		<>
			<h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>
			<SectionWrapper className="mt-28">
				<PostCollection
					title={`${
						posts.length !== 0
							? `Listing ${posts.length} ${
									posts.length === 1 ? 'post' : 'posts'
								} in ${catNames?.join(', ') ?? 'a category filter'}`
							: 'No posts found'
					}`}
					posts={posts.map(post => {
						return {
							...post,
							createdAt: new Date(post.createdAt),
							updatedAt: new Date(post.updatedAt),
						}
					})}
				/>
			</SectionWrapper>
		</>
	)
}
