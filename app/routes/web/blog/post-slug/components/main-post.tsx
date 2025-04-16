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
					<input
						id="title"
						name="title"
						type="text"
						placeholder="Give a sensational title..."
						value={post.title}
						onChange={e => onTitleChange?.(e.target.value)}
						className="text-3xl font-bold tracking-tight leading-normal md:text-4xl md:leading-tight bg-transparent border-none outline-none w-full"
					/>
				) : (
					<h1 className="text-3xl font-bold tracking-tight leading-normal md:text-4xl md:leading-tight">
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
