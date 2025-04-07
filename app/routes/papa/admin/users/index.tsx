import { useFetcher, useLoaderData } from 'react-router'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
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
        accessorKey: 'status',
        header: 'Status',
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
                                    action: `/admin/users/admins/${id}/delete`,
                                    encType: 'application/json',
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
                        action={`/admin/users`}
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
