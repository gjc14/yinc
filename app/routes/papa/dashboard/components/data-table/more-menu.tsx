import { useState } from 'react'
import { useFetcher } from 'react-router'

import { Loader2, MoreHorizontal } from 'lucide-react'

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
import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

export const DashboardDataTableMoreMenu = ({
	id,
	children,
	hideDelete,
	deleteTarget = '-->',
	onDelete,
}: {
	id: number | string
	/** Optional children, you could use <DropdownMenuItem> */
	children?: React.ReactNode
	/** If you don't want to provide delete function */
	hideDelete?: boolean
	/**
	 * Pass in for the display name of this object
	 * @default - using id
	 */
	deleteTarget?: string
	/** Callback function to handle deletion */
	onDelete?: () => void
}) => {
	const fetcher = useFetcher()
	const [open, setOpen] = useState(false)

	const isSubmitting = fetcher.state === 'submitting'
	const isDeleting = fetcher.state !== 'idle'

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size={'icon'} disabled={isDeleting}>
					<span className="sr-only">Open menu</span>
					{isSubmitting ? (
						<Loader2 className="animate-spin" />
					) : (
						<MoreHorizontal />
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuLabel>Manage</DropdownMenuLabel>

				{children && (
					<>
						<DropdownMenuSeparator />
						{children}
					</>
				)}

				{!hideDelete && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => setOpen(true)}>
							Delete
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete{' '}
							<span className="font-bold text-primary">{deleteTarget}</span>
							(id: {id}).
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={onDelete}
						>
							Continue to delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</DropdownMenu>
	)
}
