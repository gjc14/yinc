import type { Route } from './+types/route'
import { Link, useLocation } from 'react-router'

import { ArrowLeft, HeartCrack } from 'lucide-react'

import { getPostBySlug } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'

import { Post } from '../components/post'

export const meta = ({ data }: Route.MetaArgs) => {
	if (!data || !data.post || !data.meta) {
		return [{ name: 'title', content: 'Post - Not Found' }]
	}
	return data.meta.metaTags
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const url = new URL(request.url)
	const { searchParams } = url
	const preview = searchParams.get('preview') === 'true'

	const { seo } = await getSEO(url.pathname)
	const meta = seo ? createMeta(seo, url) : null

	const { postSlug } = params

	process.env.NODE_ENV === 'development' && console.time('getPostBySlug')
	const { post, nextPost, prevPost } = await getPostBySlug(
		postSlug,
		preview ? 'DRAFT' : 'PUBLISHED',
	)
	process.env.NODE_ENV === 'development' && console.timeEnd('getPostBySlug')

	return {
		meta,
		post,
		nextPost,
		prevPost,
	}
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
	const { search } = useLocation()

	const { post, nextPost, prevPost } = loaderData

	if (!post) {
		return (
			<div className="mx-auto flex flex-1 flex-col items-center justify-center space-y-6">
				<HeartCrack className="size-36" />
				<h1>Post Not found</h1>
			</div>
		)
	}

	return (
		<div className="mx-auto w-full max-w-prose px-3">
			<Link
				to={'..' + search}
				className="mb-3 inline-flex"
				title="Go back"
				aria-label="Go back"
			>
				<ArrowLeft className="cursor-pointer" />
			</Link>
			<Post post={post} next={nextPost} prev={prevPost} />
		</div>
	)
}
