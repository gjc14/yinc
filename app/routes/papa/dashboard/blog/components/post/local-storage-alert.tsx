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

import { isRestoreAlertOpenAtom, postAtom } from '../../context'
import { areDifferentPosts, convertStringDatesToDateObjects } from '../../utils'

export const postLocalStorageKey = (id: number) => `dirty-post-${id}`

/**
 * Initialize local storage to detect unsaved changes.
 */
export const PostLocalStorageInitialize = () => {
	const [isRestoreAlertOpen, setIsRestoreAlertOpen] = useAtom(
		isRestoreAlertOpenAtom,
	)

	const [post, setPost] = useAtom(postAtom)

	useEffect(() => {
		if (window) {
			const dirtyPost = window.localStorage.getItem(localStorageKey)
			if (!dirtyPost) return

			if (post) {
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

	if (!post) return null

	const localStorageKey = postLocalStorageKey(post.id)

	const handleDiscard = () => {
		window.localStorage.removeItem(localStorageKey)

		setIsRestoreAlertOpen(false)
	}

	const handleRestore = () => {
		const dirtyPost = window.localStorage.getItem(localStorageKey)
		if (!dirtyPost) return

		const postWithDates = convertStringDatesToDateObjects(JSON.parse(dirtyPost))

		setPost(postWithDates)

		setIsRestoreAlertOpen(false)
	}

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
