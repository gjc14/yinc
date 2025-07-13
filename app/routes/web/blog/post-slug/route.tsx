import 'highlight.js/styles/base16/atelier-dune.min.css'

import type { Route } from './+types/route'
import { useEffect } from 'react'

import { common, createLowlight } from 'lowlight'

import { MainPost } from './components/main-post'
import { PostFooter } from './components/post-footer'
import { hilightInnerHTML } from './highlight-inner-html'

// export type PostLoaderType = Awaited<ReturnType<typeof loader>>

export default function BlogPost({ matches, params }: Route.ComponentProps) {
	const { posts } = matches[2].data
	const lowlight = createLowlight(common)
	const languages = lowlight.listLanguages()

	const currentPostIndex = posts.findIndex(
		post => post.slug === params.postSlug,
	)
	const currentPost = currentPostIndex !== -1 ? posts[currentPostIndex] : null
	const nextPost =
		currentPostIndex < posts.length - 1 ? posts[currentPostIndex + 1] : null
	const prevPost = currentPostIndex > 0 ? posts[currentPostIndex - 1] : null

	useEffect(() => {
		document.querySelectorAll('pre code').forEach(block => {
			hilightInnerHTML(block, lowlight, languages)
		})
	}, [currentPost])

	if (!currentPost) {
		return (
			<div className="mt-32 min-h-svh w-full max-w-prose px-5 xl:px-0">
				<h1 className="text-3xl font-bold">Post not found</h1>
			</div>
		)
	}

	return (
		<div className="mt-32 min-h-svh w-full max-w-prose px-5 xl:px-0">
			<MainPost post={currentPost} />

			<PostFooter post={currentPost} next={nextPost} prev={prevPost} />
		</div>
	)
}
