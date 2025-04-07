import { type ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useFetcher, useLoaderData } from 'react-router'

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

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle title="Users"></AdminTitle>
            </AdminHeader>
            <DataTable columns={columns} data={users} hideColumnFilter>
                {table => (
                    <Input
                        placeholder="Filter email..."
                        value={
                            (table
                                .getColumn('email')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={event =>
                            table
                                .getColumn('email')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
            </DataTable>
        </AdminSectionWrapper>
    )
}

type UsersLoaderType = Awaited<ReturnType<typeof loader>>['users'][number]

export const columns: ColumnDef<UsersLoaderType>[] = [
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
                    variant={
                        row.original.emailVerified ? 'secondary' : 'destructive'
                    }
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
                <Badge
                    variant={row.original.banned ? 'destructive' : 'secondary'}
                >
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
            const id = row.original.id
            const userEmail = row.original.email

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
                                }
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
