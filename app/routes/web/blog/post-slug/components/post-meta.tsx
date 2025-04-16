import { Link } from 'react-router'
import { Fragment } from 'react/jsx-runtime'

import { generateHTML } from '@tiptap/html'
import { LibraryBig } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import ExtensionKit from '~/components/editor/extensions/extension-kit'

import type { PostLoaderType } from '../route'

export function PostMeta({ post }: { post: PostLoaderType['post'] }) {
	return (
		<div className="w-full mx-auto py-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						<AvatarImage
							src={post.author?.image || '/placeholders/avatar.png'}
							alt={post.author?.name || 'Author avatar'}
						/>
						<AvatarFallback>
							{post.author?.name?.charAt(0) || 'P'}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<Button
							className="w-fit h-6 flex items-center font-medium text-base px-0"
							variant={'link'}
						>
							{post.author?.name || post.author?.email}
						</Button>
						<div className="flex items-center gap-1 text-sm text-muted-foreground text-wrap">
							<span>{post.updatedAt.toDateString()}</span>
							<span className="px-1">·</span>
							<span>
								{post.content
									? `${Math.ceil(
											generateHTML(JSON.parse(post.content), [
												...ExtensionKit({ openOnClick: true }),
											]).length / 250,
										)} min read`
									: '0 min read'}
							</span>
						</div>
					</div>
				</div>
			</div>

			<Separator className="mt-6" />

			{post.categories.length > 0 && (
				<>
					<div className="flex items-center text-base my-3 px-2">
						<LibraryBig size={16} className="mr-2 shrink-0" />
						<div className="mr-auto">
							{post.categories.map((c, i) => (
								<Fragment key={i}>
									<Link to={`/blog/category?q=${c.slug}`}>
										<Button variant={'link'} className="h-fit p-0">
											{c.name}
										</Button>
									</Link>
									{i < post.categories.length - 1 && (
										<span className="px-1.5">&</span>
									)}
								</Fragment>
							))}
						</div>

						{/* TODO: Add functions */}
						{/* <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    >
                        <ShareIcon className="h-5 w-5" />
                        <span className="sr-only">Share</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    >
                        <BookmarkIcon className="h-5 w-5" />
                        <span className="sr-only">Bookmark</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    >
                        <MoreHorizontalIcon className="h-5 w-5" />
                        <span className="sr-only">More options</span>
                    </Button>
                </div> */}
					</div>

					<Separator className="mb-8" />
				</>
			)}
		</div>
	)
}
