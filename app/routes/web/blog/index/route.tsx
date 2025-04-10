import {
	useLoaderData,
	type ClientLoaderFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
} from 'react-router'

import { getPosts } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'

import { SectionWrapper } from '../components/max-width-wrapper'
import { PostCollection } from '../components/posts'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data || !data.meta) {
		return []
	}

	return data.meta.metaTags
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { seo } = await getSEO(new URL(request.url).pathname)
	const meta = seo ? createMeta(seo, new URL(request.url)) : null

	try {
		const { posts } = await getPosts({ status: 'PUBLISHED' })
		return { meta, posts }
	} catch (error) {
		console.error(error)
		return { meta, posts: [] }
	}
}

let cache: Awaited<ReturnType<typeof loader>>
export const clientLoader = async ({
	serverLoader,
}: ClientLoaderFunctionArgs) => {
	if (cache) {
		return cache
	}

	cache = await serverLoader()
	return cache
}

clientLoader.hydrate = true

export default function Index() {
	const { meta, posts } = useLoaderData<typeof loader>()

	return (
		<>
			<h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>
			<SectionWrapper className="mt-28">
				<PostCollection
					title="All posts"
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
