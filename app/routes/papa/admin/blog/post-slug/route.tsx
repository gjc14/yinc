import { useEffect, useRef, useState } from 'react'
import { Link, useFetcher, useNavigate, useParams } from 'react-router'

import { ExternalLink, Loader2, Save, Settings, Trash } from 'lucide-react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import type { PostWithRelations } from '~/lib/db/post.server'
import { generateSlug } from '~/lib/utils/seo'
import { useAdminBlogContext } from '~/routes/papa/admin/blog/layout'
import { AdminSectionWrapper } from '~/routes/papa/admin/components/admin-wrapper'

import { PostComponent, type PostHandle } from '../components/post-component'
import type { action } from '../resource'

export default function AdminSlugPost() {
	const fetcher = useFetcher<typeof action>()
	const navigate = useNavigate()
	const params = useParams()

	const { tags, categories, posts } = useAdminBlogContext()

	const postContentRef = useRef<PostHandle>(null)
	const [isDirty, setIsDirty] = useState(false)
	const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

	const post = posts.find(p => p.slug === params.postSlug)

	const isSubmitting = fetcher.state === 'submitting'
	const isSaving = isSubmitting && fetcher.formMethod === 'PUT'
	const isDeleting = isSubmitting && fetcher.formMethod === 'DELETE'
	const isNavigating = fetcher.state === 'loading'

	useEffect(() => {
		if (fetcher.state === 'loading' && fetcher.data) {
			if (fetcher.formMethod === 'DELETE') {
				fetcher.data.data && navigate('/admin/blog')
			}
			if (fetcher.formMethod === 'PUT') {
				const updatedPost = fetcher.data.data
				updatedPost.slug !== post?.slug &&
					navigate('/admin/blog/' + updatedPost.slug)
				window.localStorage.removeItem(`dirty-post-${post?.id}`)
			}
		}
	}, [fetcher])

	if (!post) {
		return <h2 className="grow flex items-center justify-center">Not found</h2>
	}

	// Handle db save
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
	}

	// Handle db delete
	const handleDelete = async () => {
		if (!post || isSubmitting) return

		fetcher.submit(
			{
				id: post.id,
			},
			{
				method: 'DELETE',
				action: '/admin/blog/resource',
				encType: 'application/json',
			},
		)
	}

	// Handle post change
	const handleDiscard = () => {
		postContentRef.current?.discardRequest()
	}

	const toggleSettings = () => {
		postContentRef.current?.toggleSettings()
	}

	return (
		<AdminSectionWrapper className="items-center pt-16 md:pt-12">
			{/* Delete post alert */}
			<PostDeleteAlert
				open={deleteAlertOpen}
				onOpenChange={setDeleteAlertOpen}
				post={post}
				handleDelete={handleDelete}
				isDeleting={isDeleting}
				isNavigating={isNavigating}
			/>

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
				{isDirty && (
					<Button size={'sm'} variant={'destructive'} onClick={handleDiscard}>
						<Trash height={16} width={16} />
						<p className="text-xs">Discard</p>
					</Button>
				)}

				{/* Save */}
				<Button
					type="submit"
					size={'sm'}
					disabled={!isDirty || isSubmitting}
					onClick={handleSave}
				>
					{isSaving ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<Save size={16} />
					)}
					<p className="text-xs">Save</p>
				</Button>

				{/* Open settings */}
				<Button
					className="rounded-full"
					size={'icon'}
					variant={'outline'}
					onClick={toggleSettings}
				>
					<Settings />
				</Button>
			</div>

			<PostComponent
				ref={postContentRef}
				post={post}
				tags={tags}
				categories={categories.map(c => {
					const { subCategories, ...categoryWithoutSub } = c
					return categoryWithoutSub
				})}
				isDirty={isDirty}
				setIsDirty={setIsDirty}
				onSave={handleSave}
				onDeleteRequest={() => setDeleteAlertOpen(true)}
			/>
		</AdminSectionWrapper>
	)
}

const PostDeleteAlert = ({
	post,
	handleDelete,
	open,
	onOpenChange,
	isDeleting,
	isNavigating,
}: {
	post: PostWithRelations
	handleDelete: () => void
	open: boolean
	onOpenChange: (open: boolean) => void
	isDeleting: boolean
	isNavigating: boolean
}) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete{' '}
						<span className="font-bold text-primary">{post.title}</span> (id:{' '}
						{post.id}).
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={isDeleting || isNavigating}
						onClick={e => {
							e.preventDefault()
							handleDelete()
						}}
					>
						{(isDeleting || isNavigating) && (
							<Loader2 className="animate-spin" />
						)}
						{isNavigating ? 'Redirecting...' : 'Delete permanently'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
