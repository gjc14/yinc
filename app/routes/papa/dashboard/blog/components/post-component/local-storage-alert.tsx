import { useEffect } from 'react'

import { useAtom } from 'jotai'
import isEqual from 'lodash/isEqual'

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

import { editorAtom, isRestoreAlertOpenAtom, postAtom } from '../../context'
import { areDifferentPosts, convertStringDatesToDateObjects } from '../../utils'

/**
 * Initialize local storage to detect unsaved changes.
 */
export const PostLocalStorageInitialize = () => {
	const [isRestoreAlertOpen, setIsRestoreAlertOpen] = useAtom(
		isRestoreAlertOpenAtom,
	)
	const [post, setPost] = useAtom(postAtom)
	const [editor] = useAtom(editorAtom)

	if (!post) return null

	const postLocalStorageKey = `dirty-post-${post.id}`

	const handleDiscard = () => {
		if (!window) return
		window.localStorage.removeItem(postLocalStorageKey)

		setIsRestoreAlertOpen(false)
	}

	const handleRestore = () => {
		if (!window) return
		const postContentString = window.localStorage.getItem(postLocalStorageKey)
		if (!postContentString) return

		const localPostContent = JSON.parse(postContentString)

		const postWithDates = convertStringDatesToDateObjects(localPostContent)

		setPost(postWithDates)
		// Ensure editor content is also updated if it exists in the stored object
		if (postWithDates.content !== undefined) {
			editor?.commands.setContent(JSON.parse(postWithDates.content))
		}

		setIsRestoreAlertOpen(false)
	}

	useEffect(() => {
		if (window) {
			const dirtyPost = window.localStorage.getItem(postLocalStorageKey)

			if (dirtyPost) {
				if (areDifferentPosts(post, JSON.parse(dirtyPost))) {
					setIsRestoreAlertOpen(true)
					console.log(
						'[init] areDifferentPosts: true',
						'isEqual',
						isEqual(post, JSON.parse(dirtyPost)),
					)
				} else {
					// Object.is should always return false here
					console.log(
						'[init] areDifferentPosts: false',
						'isEqual',
						isEqual(post, JSON.parse(dirtyPost)),
					)
				}
			}
		}
	}, [])

	return (
		<AlertDialog open={isRestoreAlertOpen} onOpenChange={setIsRestoreAlertOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Unsaved Changes Detected!</AlertDialogTitle>
					<AlertDialogDescription>
						You made some changes to post <strong>{post.title}</strong> (id:{' '}
						{post.id}) last time. Restore or Discard?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleDiscard}>Discard</AlertDialogCancel>
					<AlertDialogAction onClick={handleRestore}>Restore</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
