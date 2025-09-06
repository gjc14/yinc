import type { Route } from './+types/route'
import { data, Link, useLocation } from 'react-router'

import { ArrowLeft, HeartCrack } from 'lucide-react'

import { getPostBySlug } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'

import { Post } from '../components/post'
import { fetchPost, headers, postServerMemoryCache, TTL } from './cache'

export const meta = ({ data }: Route.MetaArgs) => {
	if (!data || !data.post || !data.meta) {
		return [{ name: 'title', content: 'Post - Not Found' }]
	}
	return data.meta.metaTags
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const url = new URL(request.url)
	const { searchParams, pathname } = url
	const preview = searchParams.get('preview') === 'true'

	const { postSlug } = params

	if (preview) {
		const { seo } = await getSEO(pathname)
		const meta = seo ? createMeta(seo, url) : null
		const { post, nextPost, prevPost } = await getPostBySlug(postSlug, 'DRAFT')
		return data(
			{ meta, post, nextPost, prevPost },
			{
				headers: {
					'Cache-Control': 'no-store',
				},
			},
		)
	}

	const now = Date.now()
	const entry = postServerMemoryCache.get(postSlug)

	// cache hit
	if (entry && entry.data && entry.expiresAt > now) {
		return data(entry.data, { headers })
	}

	// inflight dedupe
	if (entry?.promise) {
		const payload = await entry.promise
		return data(payload, { headers })
	}

	// cache miss
	const promise = fetchPost(postSlug, url)
	postServerMemoryCache.set(postSlug, { expiresAt: 0, promise })

	const payload = await promise
	postServerMemoryCache.set(postSlug, {
		data: payload,
		expiresAt: Date.now() + TTL,
	})

	return data(payload, { headers })
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
