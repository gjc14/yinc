import type { Route } from './+types/route'
import { useEffect, useMemo, useState } from 'react'
import { Link, useFetcher } from 'react-router'

import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, PlusCircle } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import type { PostWithRelations } from '~/lib/db/post.server'
import {
	DashboardActions,
	DashboardHeader,
	DashboardSectionWrapper,
	DashboardTitle,
} from '~/routes/papa/dashboard/components/dashboard-wrapper'
import {
	DashboardDataTableMoreMenu,
	DataTable,
} from '~/routes/papa/dashboard/components/data-table'

import { SimpleSortHeader } from '../../components/data-table/simple-sort-header'

export default function DashboardPost({ matches }: Route.ComponentProps) {
	const match = matches[2]
	const { posts, tags, categories } = match.data

	const [rowSelection, setRowSelection] = useState({})
	const [rowsDeleting, setRowsDeleting] = useState<Set<string>>(new Set())

	useEffect(() => {
		console.log('rowSelection', rowSelection)
	}, [rowSelection, rowsDeleting])

	const tableData = useMemo(() => {
		return posts.map(p => {
			return {
				...p,
				setRowsDeleting,
			}
		})
	}, [posts])

	return (
		<DashboardSectionWrapper>
			<DashboardHeader>
				<DashboardTitle title="Posts"></DashboardTitle>
				<DashboardActions>
					<Link to="/dashboard/blog/new">
						<Button size={'sm'}>
							<PlusCircle size={16} />
							<p className="text-xs">Create new post</p>
						</Button>
					</Link>
				</DashboardActions>
			</DashboardHeader>
			<DataTable
				columns={columns}
				data={tableData}
				hideColumnFilter
				rowSelection={rowSelection}
				setRowSelection={setRowSelection}
				rowGroupStyle={[
					{
						rowIds: rowsDeleting,
						className: 'opacity-50 pointer-events-none',
					},
				]}
			>
				{table => (
					<Input
						placeholder="Filter title..."
						value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
						onChange={event =>
							table.getColumn('title')?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
				)}
			</DataTable>
		</DashboardSectionWrapper>
	)
}

export const columns: ColumnDef<
	PostWithRelations & {
		setRowsDeleting: React.Dispatch<React.SetStateAction<Set<string>>>
	}
>[] = [
	{
		accessorKey: 'title',
		header: ({ column }) => {
			return <SimpleSortHeader column={column}>Title</SimpleSortHeader>
		},
	},
	{
		accessorKey: 'excerpt',
		header: 'Excerpt',
	},
	{
		accessorKey: 'status',
		header: ({ column }) => {
			return <SimpleSortHeader column={column}>Status</SimpleSortHeader>
		},
	},
	{
		accessorKey: 'author',
		header: ({ column }) => {
			return <SimpleSortHeader column={column}>Author</SimpleSortHeader>
		},
		accessorFn: row => row.author?.name || 'author',
	},
	{
		id: 'Updated At',
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

			const rowId = row.id
			const id = row.original.id
			const slug = row.original.slug
			const title = row.original.title

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
				<DashboardDataTableMoreMenu
					id={id}
					deleteTarget={title}
					onDelete={() => {
						fetcher.submit(
							{ id },
							{
								method: 'DELETE',
								action: `/dashboard/blog/resource`,
								encType: 'application/json',
							},
						)
					}}
				>
					<Link to={`/dashboard/blog/${slug}`}>
						<DropdownMenuItem>Edit</DropdownMenuItem>
					</Link>
				</DashboardDataTableMoreMenu>
			)
		},
	},
]
