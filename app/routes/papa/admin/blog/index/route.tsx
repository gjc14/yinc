import { useEffect, useMemo, useState } from 'react'
import { Link, useFetcher } from 'react-router'

import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, PlusCircle } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
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

import { useAdminBlogContext } from '../layout'

export default function AdminPost() {
	const { posts, tags, categories } = useAdminBlogContext()
	const [tagsState, setTagsState] = useState(
		tags.map(tag => {
			return {
				...tag,
				posts: posts.filter(post => post.tags.map(t => t.id).includes(tag.id)),
			}
		}),
	)
	const [categoriesState, setCategoriesState] = useState(
		categories.map(category => {
			return {
				...category,
				posts: posts.filter(post =>
					post.categories.map(c => c.id).includes(category.id),
				),
			}
		}),
	)
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
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle title="Posts"></AdminTitle>
				<AdminActions>
					<Link to="/admin/blog/new">
						<Button size={'sm'}>
							<PlusCircle size={16} />
							<p className="text-xs">Create new post</p>
						</Button>
					</Link>
				</AdminActions>
			</AdminHeader>
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
		</AdminSectionWrapper>
	)
}

type PostLoaded = ReturnType<typeof useAdminBlogContext>['posts'][number]

export const columns: ColumnDef<
	PostLoaded & {
		setRowsDeleting: React.Dispatch<React.SetStateAction<Set<string>>>
	}
>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'excerpt',
		header: 'Excerpt',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'author',
		header: 'Author',
		accessorFn: row => row.author?.name || 'author',
	},
	{
		id: 'Updated At',
		accessorKey: 'updatedAt',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Last Update
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
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
				<AdminDataTableMoreMenu
					id={id}
					deleteTarget={title}
					onDelete={() => {
						fetcher.submit(
							{ id },
							{
								method: 'DELETE',
								action: `/admin/blog/resource`,
								encType: 'application/json',
							},
						)
					}}
				>
					<Link to={`/admin/blog/${slug}`}>
						<DropdownMenuItem>Edit</DropdownMenuItem>
					</Link>
				</AdminDataTableMoreMenu>
			)
		},
	},
]
