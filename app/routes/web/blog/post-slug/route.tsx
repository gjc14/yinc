import 'highlight.js/styles/base16/atelier-dune.min.css'

import { generateHTML } from '@tiptap/html'
import { common, createLowlight } from 'lowlight'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import {
	type ClientLoaderFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
	useLoaderData,
	useNavigate,
} from 'react-router'

import ExtensionKit from '~/components/editor/extensions/extension-kit'
import { getPostBySlug } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'
import { validateAdminSession } from '~/routes/papa/auth/utils'
import { FeaturedImage } from './featured-image'
import { hilightInnerHTML } from './highlight-inner-html'
import { PostFooter } from './post-footer'
import { PostMeta } from './post-meta'

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
		throw new Response('Post not found', { status: 404 })
	}

	const { searchParams } = new URL(request.url)
	const preview = searchParams.get('preview')

	if (preview) {
		await validateAdminSession(request)
	}

	try {
		const { post, prevPost, nextPost } = await getPostBySlug(params.postSlug)
		if (!post || (!preview && post.status !== 'PUBLISHED')) {
			throw new Response('Post not found', { status: 404 })
		}
		post.content = post.content
			? generateHTML(JSON.parse(post.content), [
					...ExtensionKit({ openOnClick: true }),
			  ])
			: '<p>This is an empty post</p>'
		return { post, prevPost, nextPost, meta }
	} catch (error) {
		console.error(error)
		throw new Response('Post not found', { status: 404 })
	}
}

export type PostLoaderType = Awaited<ReturnType<typeof loader>>

let cache: Record<string, Awaited<ReturnType<typeof loader>> | undefined> = {}
export const clientLoader = async ({
	serverLoader,
	params,
}: ClientLoaderFunctionArgs) => {
	const postSlug = params.postSlug
	if (!postSlug) throw new Response('Post not found', { status: 404 })

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
	const navigate = useNavigate()
	const { post, prevPost, nextPost } = useLoaderData<typeof loader>()
	const lowlight = createLowlight(common)
	const languages = lowlight.listLanguages()

	useEffect(() => {
		document.querySelectorAll('pre code').forEach(block => {
			hilightInnerHTML(block, lowlight, languages)
		})
	}, [post])

	return (
		<div className="w-full max-w-prose min-h-screen px-5 text-pretty xl:px-0">
			<ArrowLeft
				size={20}
				className="absolute mt-16 cursor-pointer"
				onClick={() => navigate(-1)}
			/>

			<div className="pt-28 space-y-6">
				<h1 className="text-3xl font-bold tracking-tight leading-normal md:text-4xl md:leading-tight">
					{post.title}
				</h1>

				<FeaturedImage
					src={post.featuredImage || 'https://placehold.co/600x400'}
					alt={post.title + ' image'}
					description={post.title + ' image'}
				/>

				<PostMeta post={post} />
			</div>

			<article
				className="w-full mx-auto text-xl"
				dangerouslySetInnerHTML={{ __html: post.content || '' }}
			/>

			<div>
				<PostFooter post={post} next={nextPost} prev={prevPost} />
			</div>
		</div>
	)
}
