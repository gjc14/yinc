import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'
import { useFetcher, useNavigate } from 'react-router'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import DefaultTipTap, {
	type EditorRef,
} from '~/components/editor/default-tiptap'
import { FullScreenLoading } from '~/components/loading'
import type { PostWithRelations } from '~/lib/db/post.server'
import type { Category, Tag } from '~/lib/db/schema'
import { type ConventionalActionResponse } from '~/lib/utils'
import { useDebounce } from '~/lib/utils/debounce'
import { MainPost } from '~/routes/web/blog/post-slug/components/main-post'

import { areDifferentPosts, convertStringDatesToDateObjects } from '../../utils'
import { PostSettings } from './post-settings'

interface PostContentProps {
	post: PostWithRelations
	tags: Tag[]
	categories: Category[]
	onDirtyChange: (isDirty: boolean) => void
	onSave?: () => void
}

export interface PostContentHandle {
	getPostState: () => PostWithRelations
	resetPost: () => void
}

// TODO: Add featured image; edit author; publish schedule
// TODO: Editor upload image; link setting popup
export const PostContent = forwardRef<PostContentHandle, PostContentProps>(
	({ post, tags, categories, onDirtyChange, onSave }, ref) => {
		const fetcher = useFetcher<ConventionalActionResponse>()
		const navigate = useNavigate()

		const editorRef = useRef<EditorRef | null>(null)
		const isDirtyPostInitialized = useRef(false)

		const [openAlert, setOpenAlert] = useState(false) // AlertDialog
		const [postState, setPostState] = useState<PostWithRelations>(post)
		const [isDirty, setIsDirty] = useState(false)

		const postLocalStorageKey = `dirty-post-${postState.id}`

		const removeLocalStorageContent = () => {
			if (!window) return
			window.localStorage.removeItem(postLocalStorageKey)

			isDirtyPostInitialized.current = true
		}

		const memoDateConverter = useCallback((localDirtyPost: any) => {
			return convertStringDatesToDateObjects(localDirtyPost)
		}, [])

		const recoverLocalStorageContent = () => {
			if (!window) return
			const postContentString = window.localStorage.getItem(postLocalStorageKey)
			if (!postContentString) return

			const postContentLocal = JSON.parse(postContentString)

			const postWithDates = memoDateConverter(postContentLocal)

			setPostState(postWithDates)
			// Ensure editor content is also updated if it exists in the stored object
			if (postWithDates.content !== undefined) {
				editorRef.current?.updateContent(postWithDates.content)
			}

			isDirtyPostInitialized.current = true
		}

		const debouncedContentUpdate = useDebounce(
			(content: string) => {
				setPostState(prev => ({
					...prev,
					content,
				}))
			},
			500,
			[],
		)

		const debouncedLocalStorageUpdate = useDebounce(
			(post: PostWithRelations) => {
				if (!window) return
				window.localStorage.setItem(postLocalStorageKey, JSON.stringify(post))
			},
			500,
			[],
		)

		const isDeleting = fetcher.state !== 'idle'

		const handleDelete = () => {
			fetcher.submit(
				{
					id: postState.id,
				},
				{
					method: 'DELETE',
					action: '/admin/blog/resource',
					encType: 'application/json',
				},
			)
		}

		// Initialize recover/discard unsaved changes
		// If not dirty initialized, if dirty initialized after recover/discard
		useEffect(() => {
			if (window) {
				const dirtyPost = window.localStorage.getItem(postLocalStorageKey)

				if (dirtyPost) {
					if (areDifferentPosts(postState, JSON.parse(dirtyPost))) {
						setOpenAlert(true)
					}
				} else {
					isDirtyPostInitialized.current = true
				}
			}
		}, [])

		useEffect(() => {
			// Every time post loaded, check current edit state with post loaded
			const diff = areDifferentPosts(postState, post)
			if (diff) {
				onDirtyChange(true)
				setIsDirty(true)
			} else {
				onDirtyChange(false)
				setIsDirty(false)
			}
		}, [post])

		// Save dirty to local when post content changes
		useEffect(() => {
			if (!window) return
			if (!isDirtyPostInitialized.current) return

			const diff = areDifferentPosts(postState, post)
			if (diff) {
				if (!isDirty) {
					onDirtyChange(true)
					setIsDirty(true)
				}
				debouncedLocalStorageUpdate(postState)
			} else {
				if (isDirty) {
					onDirtyChange(false)
					setIsDirty(false)
				}
				window.localStorage.removeItem(postLocalStorageKey)
			}
		}, [postState])

		useEffect(() => {
			if (fetcher.state === 'loading' && fetcher.data) {
				const { err } = fetcher.data
				if (!err) {
					navigate('/admin/blog')
				}
			}
		}, [fetcher])

		useImperativeHandle(ref, () => ({
			getPostState: () => postState,
			resetPost() {
				setPostState(post)
				editorRef.current?.updateContent(post.content || '')
				window.localStorage.removeItem(`dirty-post-${post.id}`)
			},
		}))

		return (
			<div
				className={`w-full max-w-prose px-5 text-pretty xl:px-0 ${
					isDeleting ? ' overflow-hidden' : ''
				}`}
			>
				{/* TODO: Loading does not cover overflow */}
				{isDeleting && <FullScreenLoading contained />}
				<AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{isDirtyPostInitialized.current
									? 'Are you absolutely sure?'
									: 'Unsaved changes detected'}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{isDirtyPostInitialized.current ? (
									<>
										This action cannot be undone. This will permanently delete{' '}
										<span className="font-bold text-primary">
											{postState.title}
										</span>{' '}
										(id: {postState.id}).
									</>
								) : (
									<>
										Do you want to recover your unsaved changes? For post{' '}
										<strong>{postState.title}</strong> (id: {postState.id})
									</>
								)}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel
								onClick={() =>
									isDirtyPostInitialized.current
										? setOpenAlert(false)
										: removeLocalStorageContent()
								}
							>
								{isDirtyPostInitialized.current ? 'Cancel' : 'Discard'}
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={() =>
									isDirtyPostInitialized.current
										? handleDelete()
										: recoverLocalStorageContent()
								}
							>
								{isDirtyPostInitialized.current
									? 'Delete permanently'
									: 'Recover'}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<div className="flex flex-col">
					<MainPost
						post={postState}
						editable
						onTitleChange={v => {
							setPostState(prev => {
								const newPost = {
									...prev,
									title: v,
								}
								return newPost
							})
						}}
					>
						<DefaultTipTap
							ref={editorRef}
							content={postState.content || undefined}
							onUpdate={({ toJSON }) => {
								debouncedContentUpdate(toJSON())
							}}
							onSave={onSave}
						/>
					</MainPost>
				</div>

				<PostSettings
					postState={postState}
					setPostState={setPostState}
					tags={tags}
					categories={categories}
					editorRef={editorRef}
					setOpenAlert={setOpenAlert}
				/>
			</div>
		)
	},
)
