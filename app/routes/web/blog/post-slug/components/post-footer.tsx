import { useNavigate } from 'react-router'

import { ChevronLeftIcon } from '@radix-ui/react-icons'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import type { PostWithRelations } from '~/lib/db/post.server'

export const PostFooter = ({
	post,
	prev,
	next,
}: {
	post: PostWithRelations
	prev: { title: string; slug: string } | null
	next: { title: string; slug: string } | null
}) => {
	const navigate = useNavigate()

	return (
		<footer className="py-9 md:py-12">
			{/* Tags area */}
			{post.tags.length > 0 && (
				<ul className="flex flex-wrap items-center gap-1.5 my-8 md:my-12 md:gap-2">
					{post.tags.map(tag => (
						<li key={tag.id}>
							<Badge
								className="px-2.5 py-1 rounded-full md:text-sm cursor-pointer"
								onClick={() => navigate(`/blog?tag=${tag.slug}`)}
							>
								{tag.name}
							</Badge>
						</li>
					))}
				</ul>
			)}

			<Separator />

			{/* Navigation area */}
			<div className="grid grid-cols-2 gap-4 my-8">
				{prev ? (
					<Button
						variant="ghost"
						className="h-auto p-4 flex items-center justify-start gap-3 text-left group hover:bg-muted/50 transition-colors"
						onClick={() => navigate(`/blog/${prev.slug}`)}
					>
						<ChevronLeftIcon className="h-4 w-4 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
						<div className="min-w-0 flex-1">
							<div className="text-xs text-muted-foreground mb-1">Previous</div>
							<p className="font-medium line-clamp-2 text-wrap">{prev.title}</p>
						</div>
					</Button>
				) : (
					<div />
				)}

				{next ? (
					<Button
						variant="ghost"
						className="whitespace-break-spaces  h-auto p-4 flex items-center justify-end gap-3 text-right group hover:bg-muted/50 transition-colors"
						onClick={() => navigate(`/blog/${next.slug}`)}
					>
						<div className="min-w-0 flex-1 overflow-visible">
							<div className="text-xs text-muted-foreground mb-1">Next</div>
							<p className="font-medium line-clamp-2 text-wrap">{next.title}</p>
						</div>
						<ChevronLeftIcon className="h-4 w-4 flex-shrink-0 rotate-180 group-hover:translate-x-1 transition-transform" />
					</Button>
				) : (
					<div />
				)}
			</div>
		</footer>
	)
}
