import { useEffect, useMemo, useState } from 'react'
import { useFetcher, useLoaderData } from 'react-router'

import { type ColumnDef } from '@tanstack/react-table'

import { Badge } from '~/components/ui/badge'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
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

export const loader = async () => {
	return await getUsers()
}

export default function AdminAllUsers() {
	const { users } = useLoaderData<typeof loader>()
	const [rowsDeleting, setRowsDeleting] = useState<Set<string>>(new Set())

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
					<Input
						placeholder="Filter email..."
						value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
						onChange={event =>
							table.getColumn('email')?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
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
		header: 'Avatar',
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
		header: 'Email',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'role',
		header: 'Role',
	},
	{
		accessorKey: 'emailVerified',
		header: 'Verified',
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
		header: 'Banned',
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
		header: 'Last update',
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
									action: `/admin/users/resource`,
								},
							)
						}}
					>
						<DropdownMenuItem onClick={() => setOpen(true)}>
							Edit
						</DropdownMenuItem>
					</AdminDataTableMoreMenu>
					<UserContent
						method="PUT"
						action={`/admin/users/resource`}
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
