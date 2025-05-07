/**
 * PostMetaPart Component
 * This component is responsible for rendering the meta part of the post editor.
 */
import { useEffect, useRef, useState } from 'react'
import { useFetcher } from 'react-router'

import { CloudAlert, Loader } from 'lucide-react'
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
import { type EditorRef } from '~/components/editor'
import SeparatorWithText from '~/components/separator-with-text'
import type { PostWithRelations } from '~/lib/db/post.server'
import { PostStatus, type FileMetadata } from '~/lib/db/schema'
import { generateSeoDescription, generateSlug } from '~/lib/utils/seo'
import type { loader } from '~/routes/papa/admin/assets/resource'

import { FileGrid } from '../../../assets/components/file-grid'

export const PostMetaPart = ({
	postState,
	setPostState,
	editorRef,
}: {
	postState: PostWithRelations
	setPostState: React.Dispatch<React.SetStateAction<PostWithRelations>>
	editorRef: React.RefObject<EditorRef | null>
}) => {
	const fetcher = useFetcher<typeof loader>()

	const fileLoadedRef = useRef(false)
	const [files, setFiles] = useState<FileMetadata[]>([])
	const [origin, setOrigin] = useState<string>('')
	const [hasObjectStorage, setHasObjectStorage] = useState(false)

	const isLoading = fetcher.state !== 'idle'

	useEffect(() => {
		if (fileLoadedRef.current) return
		fetcher.load('/admin/assets/resource')
	}, [])

	useEffect(() => {
		if (fetcher.data) {
			setFiles(fetcher.data.files)
			setOrigin(fetcher.data.origin)
			setHasObjectStorage(fetcher.data.hasObjectStorage)
			fileLoadedRef.current = true
		}
	}, [fetcher])

	return (
		<>
			<div>
				<img
					src={postState.featuredImage || '/logo.png'}
					alt="featured image"
					className="w-full h-40 object-cover rounded-md mb-2"
				/>
				<Label htmlFor="image">Image</Label>
				<Input
					id="imageUrl"
					name="imageUrl"
					type="text"
					placeholder="Featured image URL?"
					value={postState.featuredImage || ''}
					onChange={e => {
						setPostState(prev => {
							const newPost = {
								...prev,
								featuredImage: e.target.value,
							}
							return newPost
						})
					}}
				/>
				<SeparatorWithText text="Or" />
				{!fileLoadedRef.current || isLoading ? (
					<Button
						size={'sm'}
						variant={'secondary'}
						className="w-full mt-2"
						disabled
					>
						<Loader className="animate-spin" /> Select from Gallery
					</Button>
				) : hasObjectStorage ? (
					<FileGrid
						files={files}
						origin={origin}
						dialogTrigger={
							<Button size={'sm'} variant={'secondary'} className="w-full mt-2">
								Select from Gallery
							</Button>
						}
						onFileSelect={file => {
							setPostState(prev => {
								const newPost = {
									...prev,
									featuredImage: `/assets/${file.id}`,
								}
								return newPost
							})
						}}
					/>
				) : (
					<div className="border rounded-xl w-full h-full min-h-60 grow flex flex-col items-center justify-center gap-3">
						<CloudAlert size={50} />
						<p className="text-center text-pretty max-w-sm">
							Please setup your S3 Object Storage to start uploading assets
						</p>
					</div>
				)}
			</div>
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
							let slug = generateSlug(postState.title)
							if (!slug) {
								slug = generateSlug(String(postState.id))
							}

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
				{/* 這邊加上 preview */}
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
