/**
 * Contains the SEO part of the post editor.
 * It includes the SEO title and SEO description fields.
 */
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { type EditorRef } from '~/components/editor/default-tiptap'
import type { PostWithRelations } from '~/lib/db/post.server'
import { generateSeoDescription } from '~/lib/utils/seo'

export const SeoPart = ({
	postState,
	setPostState,
	editorRef,
}: {
	postState: PostWithRelations
	setPostState: React.Dispatch<React.SetStateAction<PostWithRelations>>
	editorRef: React.RefObject<EditorRef>
}) => {
	return (
		<>
			<div>
				<Label htmlFor="seo-title">SEO Title</Label>
				<div className="flex items-center gap-1.5">
					<Input
						id="seo-title"
						name="seo-title"
						type="text"
						placeholder="Meta tilte should match Title (H1) for SEO."
						value={postState.seo.metaTitle ?? ''}
						onChange={e => {
							setPostState(prev => {
								const newPost = {
									...prev,
									seo: {
										...prev.seo,
										metaTitle: e.target.value,
									},
								} satisfies PostWithRelations
								return newPost
							})
						}}
					/>
					<Button
						type="button"
						variant={'secondary'}
						onClick={() => {
							setPostState(prev => {
								const newPost = {
									...prev,
									seo: {
										...prev.seo,
										metaTitle: postState.title,
									},
								} satisfies PostWithRelations
								return newPost
							})
						}}
					>
						Copy Title
					</Button>
				</div>
			</div>

			<div>
				<Label htmlFor="seo-description">SEO Description</Label>
				<Textarea
					id="seo-description"
					name="seo-description"
					rows={3}
					placeholder="Short description about your post..."
					value={postState.seo.metaDescription ?? ''}
					onChange={e => {
						setPostState(prev => {
							const newPost = {
								...prev,
								seo: {
									...prev.seo,
									metaDescription: e.target.value,
								},
							} satisfies PostWithRelations
							return newPost
						})
					}}
				/>
				<Button
					type="button"
					variant={'secondary'}
					className="mt-2"
					onClick={() => {
						setPostState(prev => {
							const text = editorRef.current?.editor?.getText() || ''
							if (!text) {
								toast.error('No content to generate SEO description')
								return prev
							}
							const newPost = {
								...prev,
								seo: {
									...prev.seo,
									metaDescription: generateSeoDescription(text),
								},
							} satisfies PostWithRelations
							return newPost
						})
					}}
				>
					Generate SEO Description
				</Button>
			</div>
		</>
	)
}
