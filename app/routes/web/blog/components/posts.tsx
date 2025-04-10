import { Link } from 'react-router'

import { type ColumnDef } from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

import { Input } from '~/components/ui/input'
import type { PostWithRelations } from '~/lib/db/post.server'

import { DataTable } from './post-data-table'

export const LatestPosts = ({ posts }: { posts: PostWithRelations[] }) => {
	return (
		<div
			id="latest-post"
			className="mx-auto max-w-5xl px-5 py-8 text-primary md:px-9"
		>
			<div className="flex flex-wrap justify-between items-end mb-12 gap-5">
				<motion.h2
					initial={{ y: 48, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					transition={{ ease: 'easeInOut', duration: 0.5 }}
					className="text-4xl font-black uppercase text-primary"
				>
					Latest Posts
				</motion.h2>
				<Link to={'/blog'} aria-label="link to blog">
					<motion.button
						initial={{ y: 48, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						transition={{ ease: 'easeInOut', duration: 0.5 }}
						className="flex items-center gap-1.5 underline-offset-4 cursor-pointer hover:underline"
					>
						See more posts
						<ExternalLink size={16} />
					</motion.button>
				</Link>
			</div>

			<Posts posts={posts} hidePagination hideSearch />
		</div>
	)
}

export const PostCollection = ({
	title,
	posts,
}: {
	title: string
	posts: PostWithRelations[]
}) => {
	return (
		<div
			id="category-post"
			className="mx-auto max-w-5xl px-5 py-8 text-primary md:px-9"
		>
			<div className="flex flex-wrap justify-between items-end mb-12 gap-5">
				<motion.h2
					initial={{ y: 48, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					transition={{ ease: 'easeInOut', duration: 0.5 }}
					className="text-4xl font-black uppercase text-primary"
				>
					{title}
				</motion.h2>
			</div>

			<Posts posts={posts} />
		</div>
	)
}

const Posts = ({
	posts,
	hidePagination,
	hideSearch,
}: {
	posts: PostWithRelations[]
	hidePagination?: boolean
	hideSearch?: boolean
}) => {
	return (
		<>
			<DataTable columns={columns} data={posts} hidePagination={hidePagination}>
				{table => (
					<>
						{!hideSearch && (
							<Input
								placeholder="I'm looking for..."
								value={
									(table.getColumn('title')?.getFilterValue() as string) ?? ''
								}
								onChange={event =>
									table.getColumn('title')?.setFilterValue(event.target.value)
								}
								className="max-w-sm"
								aria-label="search for post"
							/>
						)}
					</>
				)}
			</DataTable>
		</>
	)
}

export const columns: ColumnDef<PostWithRelations>[] = [
	{
		accessorKey: 'title',
		header: ({ column }) => {
			return 'Title'
		},
		cell: ({ row }) => {
			const title = row.original.title
			const url = `/blog/${row.original.slug}`
			const excerpt = row.original.excerpt

			const author =
				row.original.author?.name ?? row.original.author?.email ?? 'P'
			const updatedAt = row.original.updatedAt
			return (
				<div className="mx-2 my-3 flex flex-col text-pretty">
					<h2 className="text-2xl">
						<Link to={url}>{title}</Link>
					</h2>
					<p className="mt-1 text-base text-muted-foreground">{excerpt}</p>

					<div className="ml-1 pl-2 mt-3.5 md:mt-5 border-l-2 flex flex-col items-start justify-center gap-1">
						<p className="text-sm text-muted-foreground">Written by {author}</p>
						<p className="text-sm text-muted-foreground">
							{updatedAt.toLocaleDateString('zh-TW')}
						</p>
					</div>
				</div>
			)
		},
	},
]
