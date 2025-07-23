import { useAtom } from 'jotai'

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

import { isResetAlertOpenAtom, postAtom } from '../../context'

/**
 * Reset current dirty post to its initial state.
 */
export const PostResetAlert = ({ onReset }: { onReset: () => void }) => {
	const [isResetAlertOpen, setIsResetAlertOpen] = useAtom(isResetAlertOpenAtom)
	const [post] = useAtom(postAtom)

	if (!post) return null

	return (
		<AlertDialog open={isResetAlertOpen} onOpenChange={setIsResetAlertOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>You're resetting the post</AlertDialogTitle>
					<AlertDialogDescription>
						You are discarding of all unsaved changes for post{' '}
						<strong>{post.title}</strong> (id: {post.id}). Are you sure?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setIsResetAlertOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction onClick={() => onReset()}>Reset</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
