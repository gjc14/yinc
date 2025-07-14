import { generateHTML } from '@tiptap/html'

import ExtensionKit from '~/components/editor/extensions/extension-kit'
import type { PostWithRelations } from '~/lib/db/post.server'

import { PostMeta } from './post-meta'

export const MainPost = ({
	post,
	editable = false,
	onTitleChange,
	children,
}: {
	post: PostWithRelations
	editable?: boolean
	onTitleChange?: (title: string) => void
	children?: React.ReactNode
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
		</>
	)
}
