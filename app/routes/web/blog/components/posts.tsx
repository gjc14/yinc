import { Link, useLocation, useNavigate } from 'react-router'

import { AvatarImage } from '@radix-ui/react-avatar'
import { CircleCheckIcon } from 'lucide-react'
import { motion } from 'motion/react'

import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import type { PostWithRelations } from '~/lib/db/post.server'

export const PostCollection = ({
	title,
	posts,
	description,
}: {
	title: string
	posts: PostWithRelations[]
	description?: React.ReactNode
}) => {
	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-3 md:px-9">
			<div className="mb-12 flex flex-col px-6">
				<motion.h2
					initial={{ y: 48, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					transition={{ ease: 'easeInOut', duration: 0.5 }}
					className="text-8xl font-black md:text-9xl"
				>
					{title}
				</motion.h2>
				{description && (
					<div className="mt-8 rounded-md border border-emerald-500/50 px-4 py-3 text-emerald-600">
						<p className="text-sm">
							<CircleCheckIcon
								className="me-3 -mt-0.5 inline-flex opacity-60"
								size={16}
								aria-hidden="true"
							/>
							{description}
						</p>
					</div>
				)}
			</div>

			{posts.map(post => (
				<Post key={post.id} post={post} />
			))}
		</div>
	)
}

const Post = ({ post }: { post: PostWithRelations }) => {
	const navigate = useNavigate()
	const { search } = useLocation()
	const url = `/blog/${post.slug}`

	return (
		<Link to={url + search} className="group hover:bg-accent py-4 md:py-5">
			<div className="flex flex-col px-5 md:px-6">
				<div className="mb-3 flex gap-1.5">
					{post.categories.map(category => (
						<Badge
							key={category.id}
							className="bg-brand text-brand-foreground rounded-full"
							onClick={e => {
								e.stopPropagation()
								navigate(`/blog?category=${category.slug}`)
							}}
						>
							{category.name}
						</Badge>
					))}
				</div>

				<h2 className="text-xl underline-offset-4 group-hover:underline md:text-2xl">
					{post.title}
				</h2>

				<p className="text-muted-foreground mt-3 text-sm">{post.excerpt}</p>

				<div className="mt-8 flex items-center justify-start gap-3.5">
					<Avatar className="size-8">
						<AvatarImage
							src={post.author?.image || undefined}
							alt={post.author?.name || '🍟'}
						/>
						<AvatarFallback>{post.author?.name?.[0] || '🍟'}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="text-sm font-semibold">
							{post.author?.name || 'Anonymous'}
						</span>
						<span className="text-muted-foreground text-xs">
							{post.updatedAt.toLocaleDateString('zh-TW')}
						</span>
					</div>
				</div>
			</div>
		</Link>
	)
}
