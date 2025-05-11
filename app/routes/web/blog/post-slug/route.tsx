import 'highlight.js/styles/base16/atelier-dune.min.css'

import { useEffect } from 'react'
import {
	useLoaderData,
	type ClientLoaderFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
} from 'react-router'

import { common, createLowlight } from 'lowlight'

import { getPostBySlug } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'
import { validateAdminSession } from '~/routes/papa/auth/utils'

import { MainPost } from './components/main-post'
import { PostFooter } from './components/post-footer'
import { hilightInnerHTML } from './highlight-inner-html'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data || !data.meta) {
		return []
	}

	return data.meta.metaTags
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { seo } = await getSEO(new URL(request.url).pathname)
	const meta = seo ? createMeta(seo, new URL(request.url)) : null

	if (!params.postSlug) {
		throw new Response('', { status: 404, statusText: 'Post not found' })
	}

	const { searchParams } = new URL(request.url)
	const preview = searchParams.get('preview')

	if (preview) {
		await validateAdminSession(request)
	}

	try {
		const { post, prevPost, nextPost } = await getPostBySlug(params.postSlug)
		if (!post || (!preview && post.status !== 'PUBLISHED')) {
			throw new Response('', { status: 404, statusText: 'Post not found' })
		}
		return { post, prevPost, nextPost, meta }
	} catch (error) {
		console.error(error)
		throw new Response('', { status: 404, statusText: 'Post not found' })
	}
}

export type PostLoaderType = Awaited<ReturnType<typeof loader>>

let cache: Record<string, Awaited<ReturnType<typeof loader>> | undefined> = {}
export const clientLoader = async ({
	serverLoader,
	params,
}: ClientLoaderFunctionArgs) => {
	const postSlug = params.postSlug
	if (!postSlug)
		throw new Response('', { status: 404, statusText: 'Post not found' })

	const cachedPost = cache[postSlug]

	if (cache && cachedPost) {
		return cachedPost
	}

	const postData = await serverLoader<typeof loader>()
	cache = { ...cache, [postSlug]: postData }
	return postData
}

clientLoader.hydrate = true

export default function BlogPost() {
	const { post, prevPost, nextPost } = useLoaderData<typeof loader>()
	const lowlight = createLowlight(common)
	const languages = lowlight.listLanguages()

	useEffect(() => {
		document.querySelectorAll('pre code').forEach(block => {
			hilightInnerHTML(block, lowlight, languages)
		})
	}, [post])

	return (
		<div className="w-full max-w-prose min-h-svh px-5 mt-32 text-pretty xl:px-0">
			<MainPost post={post} />

			<PostFooter post={post} next={nextPost} prev={prevPost} />
		</div>
	)
}
