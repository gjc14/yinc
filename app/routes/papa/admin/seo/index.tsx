import { ActionFunctionArgs } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { userIs } from '~/lib/db/auth.server'
import { getSEOs, updateSEO } from '~/lib/db/seo.server'
import { ConventionalActionResponse } from '~/lib/utils'
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
import { SeoContent } from '~/routes/papa/admin/components/seo-content'

export const SeoUpdateSchmea = z.object({
    id: z.string().transform(val => Number(val)),
    metaTitle: z.string(),
    metaDescription: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'PUT') {
        return Response.json({
            err: 'Method not allowed',
        } satisfies ConventionalActionResponse)
    }

    await userIs(request, ['ADMIN'])

    const formData = await request.formData()
    const updateSeoData = Object.fromEntries(formData)

    const zResult = SeoUpdateSchmea.safeParse(updateSeoData)

    if (!zResult.success || !zResult.data) {
        const message = zResult.error.issues
            .map(issue => `${issue.message} ${issue.path[0]}`)
            .join(' & ')
        return Response.json({
            err: message,
        } satisfies ConventionalActionResponse)
    }

    try {
        const { seo } = await updateSEO({
            id: zResult.data.id,
            metaTitle: zResult.data.metaTitle,
            metaDescription: zResult.data.metaDescription,
        })
        return Response.json({
            msg: `SEO for ${seo.route || seo.metaTitle || 'unknown'} updated`,
        } satisfies ConventionalActionResponse)
    } catch (error) {
        console.error(error)
        return Response.json({
            err: 'Failed to update SEO',
        } satisfies ConventionalActionResponse)
    }
}

export const loader = async () => {
    const { seos } = await getSEOs()

    return { seos }
}

export type SeoLoaderType = Awaited<ReturnType<typeof loader>>['seos'][number]

export default function AdminSEO() {
    const { seos } = useLoaderData<typeof loader>()
    const [open, setOpen] = useState(false)
    const [rowsDeleting, setRowsDeleting] = useState<Set<string>>(new Set())

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle
                    title="SEO"
                    description="SEO data is connect to post or route. You could set in either here or in post or route."
                ></AdminTitle>
                <AdminActions>
                    <Button size={'sm'} onClick={() => setOpen(true)}>
                        <PlusCircle size={16} />
                        <p className="text-xs">Create seo</p>
                    </Button>
                    <SeoContent
                        method="POST"
                        action={`/admin/seo/create`}
                        open={open}
                        setOpen={setOpen}
                    />
                </AdminActions>
            </AdminHeader>
            <DataTable
                columns={columns}
                data={seos.map(s => ({
                    ...s,
                    setRowsDeleting,
                }))}
                rowGroupStyle={[
                    {
                        rowIds: rowsDeleting,
                        className: 'opacity-50 pointer-events-none',
                    },
                ]}
            >
                {table => (
                    <Input
                        placeholder="Filter route..."
                        value={
                            (table
                                .getColumn('route')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={event =>
                            table
                                .getColumn('route')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
            </DataTable>
        </AdminSectionWrapper>
    )
}

export const columns: ColumnDef<
    SeoLoaderType & {
        setRowsDeleting: React.Dispatch<React.SetStateAction<Set<string>>>
    }
>[] = [
    {
        accessorKey: 'route',
        header: 'Route',
        accessorFn: row => row.route ?? `/blog/${row.post?.slug}`,
    },
    {
        accessorKey: 'metaTitle',
        header: 'Title',
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            return (
                <span className="block w-28 md:w-60 truncate">
                    {row.original.metaDescription}
                </span>
            )
        },
    },
    {
        accessorKey: 'autoGenerated',
        header: 'System',
        accessorFn: row => (row.autoGenerated ? 'Yes' : 'No'),
    },
    {
        accessorKey: 'createdAt',
        header: 'Created at',
        accessorFn: row => new Date(row.createdAt).toLocaleString('zh-TW'),
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

            const rowId = row.id
            const [open, setOpen] = useState(false)
            const id = row.original.id
            const deleteTarget = row.original.metaTitle ?? undefined

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
                        hideDelete={row.original.autoGenerated}
                        deleteTarget={deleteTarget}
                        onDelete={() => {
                            fetcher.submit(
                                { id },
                                {
                                    method: 'DELETE',
                                    action: `/admin/seo/${id}/delete`,
                                    encType: 'application/json',
                                }
                            )
                        }}
                    >
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            Edit
                        </DropdownMenuItem>
                    </AdminDataTableMoreMenu>
                    <SeoContent
                        method="PUT"
                        action={`/admin/seo`}
                        seo={row.original}
                        open={open}
                        setOpen={setOpen}
                    />
                </>
            )
        },
    },
]
