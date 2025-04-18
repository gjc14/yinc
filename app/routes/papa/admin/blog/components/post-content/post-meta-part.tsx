/**
 * PostMetaPart Component
 * This component is responsible for rendering the meta part of the post editor.
 */
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { type EditorRef } from '~/components/editor/default-tiptap'
import type { PostWithRelations } from '~/lib/db/post.server'
import { PostStatus } from '~/lib/db/schema'
import { generateSeoDescription, generateSlug } from '~/lib/utils/seo'

export const PostMetaPart = ({
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
				<Label htmlFor="status">Status</Label>
				<Select
					value={postState.status}
					name="status"
					onValueChange={v => {
						setPostState(prev => {
							const newPost = {
								...prev,
								status: v,
							}
							return newPost
						})
					}}
				>
					<SelectTrigger id="status" className="w-[180px]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						{PostStatus.map(status => (
							<SelectItem key={status} value={status}>
								{status}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label htmlFor="slug">Slug</Label>
				<div className="flex items-center gap-1.5">
					<Input
						id="slug"
						name="slug"
						type="text"
						placeholder="How to display your post in the URL?"
						value={postState.slug}
						onChange={e => {
							setPostState(prev => {
								const newPost = {
									...prev,
									slug: e.target.value,
								}
								return newPost
							})
						}}
					/>
					<Button
						type="button"
						variant={'secondary'}
						onClick={() => {
							const slug = generateSlug(postState.title)

							setPostState(prev => {
								const newPost = {
									...prev,
									slug,
								}
								return newPost
							})
						}}
					>
						Generate
					</Button>
				</div>
			</div>

			<div>
				<Label htmlFor="excerpt">Excerpt</Label>
				<Textarea
					id="excerpt"
					name="excerpt"
					rows={3}
					placeholder="Short description about your post..."
					value={postState.excerpt || ''}
					onChange={e => {
						setPostState(prev => {
							const newPost = {
								...prev,
								excerpt: e.target.value,
							}
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
								toast.error('No content to generate excerpt')
								return prev
							}
							const newPost = {
								...prev,
								excerpt: generateSeoDescription(text),
							}
							return newPost
						})
					}}
				>
					Generate Excerpt
				</Button>
			</div>
		</>
	)
}
