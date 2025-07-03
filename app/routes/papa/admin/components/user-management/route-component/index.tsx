import { useMemo, useState } from 'react'
import { useFetcher } from 'react-router'

import { type RowSelectionState } from '@tanstack/react-table'
import { ChevronDown, Loader2, PlusCircle } from 'lucide-react'

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
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import type { user as userTable } from '~/lib/db/schema'
import {
	AdminActions,
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'
import { DataTable } from '~/routes/papa/admin/components/data-table'

import { columns } from './columns'

type User = typeof userTable.$inferSelect

export const UserManagementRoute = ({
	users,
	role,
}: {
	users: User[]
	role: 'admin' | 'user'
}) => {
	const fetcher = useFetcher()

	const [rowsDeleting, setRowsDeleting] = useState<Set<string>>(new Set())
	// The ids selected returned by setRowSelection
	// are the same as index of the raw data passed in to the table
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [openInviteDialog, setOpenInviteDialog] = useState(false)
	const [openBulkDeleteAlert, setOpenBulkDeleteAlert] = useState(false)

	const selectedUsers = useMemo(() => {
		const selectedRows = Object.keys(rowSelection).filter(
			key => rowSelection[key],
		)
		return users.filter((_, i) => selectedRows.includes(i.toString()))
	}, [rowSelection, users])

	const isSubmitting = fetcher.state === 'submitting'

	const tableData = useMemo(() => {
		return users.map(u => ({
			...u,
			setRowsDeleting,
		}))
	}, [users])

	const onBulkDelete = () => {
		if (selectedUsers.length === 0) return
		const idsToDelete = selectedUsers.map(user => user.id)
		fetcher.submit(
			{ ids: JSON.stringify(idsToDelete) },
			{
				method: 'DELETE',
				action: '/admin/users/resource?bulk=true',
			},
		)
	}

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle title={role === 'admin' ? 'Admins' : 'Users'}></AdminTitle>
				<AdminActions>
					<Button
						size={'sm'}
						disabled={isSubmitting}
						onClick={() => setOpenInviteDialog(true)}
					>
						{isSubmitting && fetcher.formMethod === 'POST' ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<PlusCircle size={16} />
						)}
						<p className="text-xs">
							Invite {role === 'admin' ? 'admin' : 'user'}
						</p>
					</Button>
				</AdminActions>
			</AdminHeader>
			<DataTable
				columns={columns}
				data={tableData}
				rowSelection={rowSelection}
				setRowSelection={setRowSelection}
				rowGroupStyle={[
					{
						rowIds: rowsDeleting,
						className: 'opacity-50 pointer-events-none',
					},
				]}
				hideColumnFilter
			>
				{table => (
					<div className="w-full flex items-center justify-between gap-2">
						<Input
							placeholder="Filter email..."
							type="email"
							value={
								(table.getColumn('email')?.getFilterValue() as string) ?? ''
							}
							onChange={event =>
								table.getColumn('email')?.setFilterValue(event.target.value)
							}
							className="max-w-sm"
						/>
						<DropdownMenu>
							<DropdownMenuTrigger asChild hidden={!selectedUsers.length}>
								<Button variant="outline" disabled={!selectedUsers.length}>
									Actions
									<ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>Bulk Operations</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => setOpenBulkDeleteAlert(true)}
									className="bg-destructive text-white"
								>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}
			</DataTable>

			<Dialog open={openInviteDialog} onOpenChange={setOpenInviteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Invite {role === 'admin' ? 'admin' : 'user'}
						</DialogTitle>
						<DialogDescription>
							We'll send an invitation link to email address provided.
						</DialogDescription>
					</DialogHeader>
					<fetcher.Form
						id="invite-user"
						className="flex flex-col gap-1.5 md:flex-row items-baseline"
						method="POST"
						action="/admin/users/resource"
					>
						<div className="w-full">
							<Label htmlFor="email">Email</Label>
							<Input id="email" placeholder="Email" type="email" name="email" />
						</div>
						<div className="w-full">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Little prince"
								type="name"
								name="name"
							/>
						</div>
					</fetcher.Form>
					<DialogFooter>
						<DialogClose asChild>
							<Button form="invite-user" type="submit">
								Invite
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={openBulkDeleteAlert}
				onOpenChange={setOpenBulkDeleteAlert}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete{' '}
							<span className="font-bold text-primary">
								{selectedUsers.length}
							</span>{' '}
							{role === 'admin' ? 'admins' : 'users'}.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={onBulkDelete}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</AdminSectionWrapper>
	)
}
