import { useEffect, useMemo, useState } from 'react'
import { useFetcher, useLoaderData } from 'react-router'

import { type ColumnDef } from '@tanstack/react-table'
import { Loader2, PlusCircle } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { getUsers } from '~/lib/db/user.server'
import {
	AdminActions,
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
	return await getUsers({
		role: 'admin',
	})
}

export default function AdminAdminUsers() {
	const fetcher = useFetcher()
	const { users } = useLoaderData<typeof loader>()
	const [rowsDeleting, setRowsDeleting] = useState<Set<string>>(new Set())

	const isSubmitting = fetcher.state === 'submitting'

	const tableData = useMemo(() => {
		return users.map(u => ({
			...u,
			setRowsDeleting,
		}))
	}, [users])

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle title="Admins"></AdminTitle>
				<AdminActions>
					<Dialog>
						<DialogTrigger asChild>
							<Button size={'sm'} disabled={isSubmitting}>
								{isSubmitting ? (
									<Loader2 size={16} className="animate-spin" />
								) : (
									<PlusCircle size={16} />
								)}
								<p className="text-xs">Invite admin</p>
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Invite admin</DialogTitle>
								<DialogDescription>
									We'll send an invitation link to email address provided.
								</DialogDescription>
							</DialogHeader>
							<fetcher.Form
								id="invite-admin"
								className="flex flex-col gap-1.5 md:flex-row items-baseline"
								method="POST"
								action="/admin/admins/resource"
							>
								<div className="w-full">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										placeholder="Email"
										type="email"
										name="email"
									/>
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
									<Button form="invite-admin" type="submit">
										Invite
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</AdminActions>
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
									action: `/admin/admins/resource`,
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
						action={`/admin/admins/resource`}
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
