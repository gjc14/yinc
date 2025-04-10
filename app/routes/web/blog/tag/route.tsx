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
		const { posts, tagsFilter } = await getPosts({
			status: 'PUBLISHED',
			tagsFilter: [slug],
		})
		return { meta, posts, tagsFilter }
	} catch (error) {
		console.error(error)
		return { meta, posts: [] }
	}
}

export default function Tag() {
	const { meta, posts, tagsFilter } = useLoaderData<typeof loader>()

	const tagNames = tagsFilter?.map(tag => tag.name)

	return (
		<>
			<h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>
			<SectionWrapper className="mt-28">
				<PostCollection
					title={`${
						posts.length !== 0
							? `Listing ${posts.length} ${
									posts.length === 1 ? 'post' : 'posts'
								} in ${tagNames?.join(', ') ?? 'a tag filter'}`
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
