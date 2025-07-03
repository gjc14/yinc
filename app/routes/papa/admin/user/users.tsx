import { useEffect, useMemo, useState } from 'react'
import { useFetcher, useLoaderData } from 'react-router'

import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { getUsers } from '~/lib/db/user.server'
import {
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'
import {
	AdminDataTableMoreMenu,
	DataTable,
} from '~/routes/papa/admin/components/data-table'
import { UserContent } from '~/routes/papa/admin/components/user-content'

import { SimpleSortHeader } from '../components/data-table/simple-sort-header'

export const loader = async () => {
	return await getUsers({
		role: 'user',
	})
}

export default function AdminAllUsers() {
	const { users } = useLoaderData<typeof loader>()
	const [rowsDeleting, setRowsDeleting] = useState<Set<string>>(new Set())
	// The ids selected returned by setRowSelection
	// are the same as index of the raw data passed in to the table
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const selectedUsers = useMemo(() => {
		const selectedRows = Object.keys(rowSelection).filter(
			key => rowSelection[key],
		)
		return users.filter((_, i) => selectedRows.includes(i.toString()))
	}, [rowSelection, users])

	const tableData = useMemo(() => {
		return users.map(u => ({
			...u,
			setRowsDeleting,
		}))
	}, [users])

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle title="Users"></AdminTitle>
			</AdminHeader>
			<DataTable
				columns={columns}
				data={tableData}
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
									onClick={() => {
										// Handle bulk delete action
										// fetcher.submit
									}}
									className="bg-destructive text-white"
								>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}
			</DataTable>
		</AdminSectionWrapper>
	)
}

type UsersLoaderType = Awaited<ReturnType<typeof loader>>['users'][number]

export const columns: ColumnDef<
	UsersLoaderType & {
		setRowsDeleting: React.Dispatch<React.SetStateAction<Set<string>>>
	}
>[] = [
	{
		accessorKey: 'image',
		header: '🙂',
		cell: ({ row }) => {
			return (
				<img
					src={row.original.image || '/placeholders/avatar.png'}
					alt={row.original.name}
					className="w-8 h-8 rounded-full"
				/>
			)
		},
	},
	{
		accessorKey: 'email',
		header: ({ column }) => {
			return <SimpleSortHeader column={column}>Email</SimpleSortHeader>
		},
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return <SimpleSortHeader column={column}>Name</SimpleSortHeader>
		},
	},
	{
		accessorKey: 'role',
		header: 'Role',
	},
	{
		accessorKey: 'emailVerified',
		header: ({ column }) => {
			return <SimpleSortHeader column={column}>Email Verified</SimpleSortHeader>
		},
		cell: ({ row }) => {
			return (
				<Badge
					variant={row.original.emailVerified ? 'secondary' : 'destructive'}
				>
					{row.original.emailVerified ? 'Yes' : 'No'}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'banned',
		header: ({ column }) => {
			return <SimpleSortHeader column={column}>Banned</SimpleSortHeader>
		},
		cell: ({ row }) => {
			return (
				<Badge variant={row.original.banned ? 'destructive' : 'secondary'}>
					{row.original.banned ? 'Yes' : 'No'}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'updatedAt',
		header: ({ column }) => {
			return <SimpleSortHeader column={column}>Updated At</SimpleSortHeader>
		},
		accessorFn: row => new Date(row.updatedAt).toLocaleString('zh-TW'),
	},
	{
		accessorKey: 'id',
		header: 'Edit',
		cell: ({ row }) => {
			const fetcher = useFetcher()
			const [open, setOpen] = useState(false)

			const rowId = row.id
			const id = row.original.id
			const userEmail = row.original.email

			useEffect(() => {
				if (fetcher.state !== 'idle') {
					row.original.setRowsDeleting(prev => {
						const newSet = new Set(prev)
						newSet.add(rowId)
						return newSet
					})
				} else {
					row.original.setRowsDeleting(prev => {
						const newSet = new Set(prev)
						newSet.delete(rowId)
						return newSet
					})
				}
			}, [fetcher.state])

			return (
				<>
					<AdminDataTableMoreMenu
						id={id}
						deleteTarget={userEmail}
						onDelete={() => {
							fetcher.submit(
								{ id },
								{
									method: 'DELETE',
									action: '/admin/user/resource',
								},
							)
						}}
					>
						<DropdownMenuItem onClick={() => setOpen(true)}>
							Edit
						</DropdownMenuItem>
					</AdminDataTableMoreMenu>
					<UserContent
						onSubmit={formData => {
							fetcher.submit(formData, {
								method: 'PUT',
								action: '/admin/user/resource',
							})
						}}
						isSubmitting={
							fetcher.formAction === '/admin/user/resource' &&
							fetcher.state === 'submitting'
						}
						user={{
							...row.original,
							updatedAt: new Date(row.original.updatedAt),
						}}
						open={open}
						setOpen={setOpen}
					/>
				</>
			)
		},
	},
]
