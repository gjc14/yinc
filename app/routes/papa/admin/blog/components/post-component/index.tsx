import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'

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
import RichTextEditor, { type EditorRef } from '~/components/editor'
import type { PostWithRelations } from '~/lib/db/post.server'
import type { Category, Tag } from '~/lib/db/schema'
import { useDebounce } from '~/lib/utils/debounce'
import { MainPost } from '~/routes/web/blog/post-slug/components/main-post'

import { areDifferentPosts, convertStringDatesToDateObjects } from '../../utils'
import { PostSettings } from './post-settings'

interface PostContentProps {
	post: PostWithRelations
	tags: Tag[]
	categories: Category[]
	isDirty: boolean
	setIsDirty: React.Dispatch<React.SetStateAction<boolean>>
	onSave: () => void
	onDeleteRequest: () => void
}

export interface PostHandle {
	getPostState: () => PostWithRelations
	discardRequest: () => void
	toggleSettings: () => void
}

// TODO: Add featured image; edit author; publish schedule
// TODO: Editor upload image; link setting popup
export const PostComponent = forwardRef<PostHandle, PostContentProps>(
	(
		{ post, tags, categories, isDirty, setIsDirty, onSave, onDeleteRequest },
		ref,
	) => {
		const editorRef = useRef<EditorRef>(null)
		const editor = editorRef.current?.editor ?? null
		const isDirtyPostInitialized = useRef(false)

		const [openAlert, setOpenAlert] = useState(false) // AlertDialog
		const [openSettings, setOpenSettings] = useState(false) // PostSettings
		const [postState, setPostState] = useState<PostWithRelations>(post)

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
				editor?.commands.setContent(JSON.parse(postWithDates.content))
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
			300,
			[],
		)

		const debouncedLocalStorageUpdate = useDebounce(
			(post: PostWithRelations) => {
				if (!window) return
				window.localStorage.setItem(postLocalStorageKey, JSON.stringify(post))
			},
			200,
			[],
		)

		const handleDiscard = () => {
			setPostState(post)
			if (!post.content) {
				return editor?.commands.clearContent()
			}
			editor?.commands.setContent(JSON.parse(post.content))
			window.localStorage.removeItem(`dirty-post-${post.id}`)
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
				setIsDirty(true)
			} else {
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
					setIsDirty(true)
				}
				debouncedLocalStorageUpdate(postState)
			} else {
				if (isDirty) {
					setIsDirty(false)
				}
				window.localStorage.removeItem(postLocalStorageKey)
			}
		}, [postState])

		useImperativeHandle(ref, () => ({
			getPostState: () => postState,
			discardRequest: () => {
				setOpenAlert(true)
			},
			toggleSettings: () => {
				setOpenSettings(prev => !prev)
			},
		}))

		return (
			<div className="w-full max-w-prose px-5 text-pretty xl:px-0">
				<AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Unsaved changes detected</AlertDialogTitle>
							<AlertDialogDescription>
								Do you want to{' '}
								{isDirtyPostInitialized.current ? 'discard' : 'recover'} your
								unsaved changes? For post <strong>{postState.title}</strong>{' '}
								(id: {postState.id})
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
										? handleDiscard()
										: recoverLocalStorageContent()
								}
							>
								{isDirtyPostInitialized.current ? 'Discard' : 'Recover'}
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
						<RichTextEditor
							ref={editorRef}
							content={postState.content || undefined}
							onUpdate={({ toJSON }) => {
								debouncedContentUpdate(toJSON())
							}}
							onSave={onSave}
						/>
					</MainPost>
				</div>

				{openSettings && (
					<PostSettings
						postState={postState}
						setPostState={setPostState}
						tags={tags}
						categories={categories}
						editorRef={editorRef}
						onDeleteRequest={onDeleteRequest}
					/>
				)}
			</div>
		)
	},
)
