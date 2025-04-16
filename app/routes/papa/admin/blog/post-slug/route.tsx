import { useRef, useState } from 'react'
import { Link, useFetcher, useParams } from 'react-router'

import { ExternalLink, Loader2, Menu, Save, Trash } from 'lucide-react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import type { PostWithRelations } from '~/lib/db/post.server'
import { type ConventionalActionResponse } from '~/lib/utils'
import { generateSlug } from '~/lib/utils/seo'
import { useAdminBlogContext } from '~/routes/papa/admin/blog/layout'
import { AdminSectionWrapper } from '~/routes/papa/admin/components/admin-wrapper'

import { PostContent, type PostContentHandle } from '../components/post-content'

export default function AdminPost() {
	const fetcher = useFetcher<ConventionalActionResponse<PostWithRelations>>()
	const params = useParams()

	const { tags, categories, posts } = useAdminBlogContext()

	const postContentRef = useRef<PostContentHandle>(null)
	const [isDirty, setIsDirty] = useState(false)

	const post = posts.find(p => p.slug === params.postSlug)

	const isSubmitting = fetcher.state === 'submitting'

	if (!post) {
		return <h2 className="grow flex items-center justify-center">Not found</h2>
	}

	const handleSave = () => {
		const postState = postContentRef.current?.getPostState()
		if (!postState || !isDirty || isSubmitting) return

		const date = new Date()
		const now = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
			2,
			'0',
		)}/${String(date.getDate()).padStart(
			2,
			'0',
		)}@${String(date.getHours()).padStart(2, '0')}:${String(
			date.getMinutes(),
		).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
		// Remove date fields and set default values
		const postReady = {
			...postState,
			title: postState.title || `Post-${now}`,
			slug: postState.slug || generateSlug(postState.title || `Post-${now}`),
			createdAt: undefined,
			updatedAt: undefined,
			seo: {
				...postState.seo,
				createdAt: undefined,
				updatedAt: undefined,
			},
		}

		fetcher.submit(JSON.stringify(postReady), {
			method: 'PUT', // Update
			encType: 'application/json',
			action: '/admin/blog/resource',
		})

		setIsDirty(false)
		window.localStorage.removeItem(`dirty-post-${post.id}`)
	}

	const handleDiscard = () => {
		postContentRef.current?.resetPost()
	}

	return (
		<AdminSectionWrapper className="items-center pt-16 md:pt-12">
			<div className="z-10 fixed top-16 right-6 flex items-center gap-2">
				{/* Preview */}
				{post.status !== 'PUBLISHED' ? (
					!isDirty ? (
						<Link to={`/blog/${post.slug}?preview=true`} target="_blank">
							<Button variant={'link'}>
								Preview post
								<ExternalLink size={12} />
							</Button>
						</Link>
					) : (
						<Button variant={'link'} className="px-2" disabled>
							Preview post
							<ExternalLink size={12} />
						</Button>
					)
				) : (
					<Link to={`/blog/${post.slug}`} target="_blank">
						<Button variant={'link'} className="px-2">
							See post
							<ExternalLink size={12} />
						</Button>
					</Link>
				)}

				{/* Discard */}
				<AlertDialog>
					{isDirty && (
						<AlertDialogTrigger asChild>
							<Button size={'sm'} variant={'destructive'}>
								<Trash height={16} width={16} />
								<p className="text-xs">Discard</p>
							</Button>
						</AlertDialogTrigger>
					)}
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Discard Post</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to discard this post
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleDiscard}>
								Discard
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				{/* Save */}
				<Button
					type="submit"
					size={'sm'}
					disabled={!isDirty}
					onClick={handleSave}
				>
					{isSubmitting ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<Save size={16} />
					)}
					<p className="text-xs">Save</p>
				</Button>

				{/* Open settings */}

				<Button className="rounded-full" size={'icon'} variant={'outline'}>
					<Menu />
				</Button>
			</div>

			<PostContent
				ref={postContentRef}
				post={post}
				tags={tags}
				categories={categories.map(c => {
					const { subCategories, ...categoryWithoutSub } = c
					return categoryWithoutSub
				})}
				onDirtyChange={isDirty => setIsDirty(isDirty)}
				onSave={handleSave}
			/>
		</AdminSectionWrapper>
	)
}
