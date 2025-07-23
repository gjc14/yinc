/**
 * This is a post display component for a blog post.
 * It make the page layout, including the title, meta information, and content.
 */
import { generateHTML } from '@tiptap/html'

import { ExtensionKit } from '~/components/editor/extensions/extension-kit'
import type { PostWithRelations } from '~/lib/db/post.server'

import { PostFooter } from './post-footer'
import { PostMeta } from './post-meta'

export const Post = ({
	post,
	editable = false,
	onTitleChange,
	children,
	prev,
	next,
}: {
	post: PostWithRelations
	editable?: boolean
	onTitleChange?: (title: string) => void
	children?: React.ReactNode
	prev?: { title: string; slug: string } | null
	next?: { title: string; slug: string } | null
}) => {
	return (
		<>
			<div className="space-y-5">
				{editable ? (
					<textarea
						id="title"
						name="title"
						placeholder="Give a sensational title..."
						value={post.title}
						onChange={e => onTitleChange?.(e.target.value)}
						className="field-sizing-content h-auto min-h-0 w-full resize-none border-none bg-transparent text-3xl leading-normal font-bold tracking-tight outline-none md:text-4xl md:leading-tight"
					/>
				) : (
					<h1 className="text-3xl leading-normal font-bold tracking-tight md:text-4xl md:leading-tight">
						{post.title}
					</h1>
				)}

				<PostMeta post={post} />
			</div>

			{editable ? (
				children
			) : (
				<article
					className="prose-article"
					dangerouslySetInnerHTML={
						editable
							? undefined
							: {
									__html: post.content
										? generateHTML(JSON.parse(post.content), [
												...ExtensionKit({ openOnClick: true }),
											])
										: '<p>This is an empty post</p>',
								}
					}
				></article>
			)}

			<PostFooter post={post} next={next} prev={prev} />
		</>
	)
}
