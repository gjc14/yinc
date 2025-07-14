import type { Route } from './+types/route'
import { useEffect, useRef, useState } from 'react'
import { Link, useFetcher, useNavigate, useParams } from 'react-router'

import { ExternalLink, Loader2, Settings, Trash } from 'lucide-react'

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
import { DashboardSectionWrapper } from '~/routes/papa/dashboard/components/dashboard-wrapper'

import { PostComponent, type PostHandle } from '../components/post-component'
import type { action } from '../resource'

export default function DashboardSlugPost({ matches }: Route.ComponentProps) {
	const fetcher = useFetcher<typeof action>()
	const navigate = useNavigate()
	const params = useParams()

	const blogMatch = matches[2]
	const { tags, categories, posts } = blogMatch.data

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
				fetcher.data.data && navigate('/dashboard/blog')
			}
			if (fetcher.formMethod === 'PUT') {
				const { data } = fetcher.data
				if (data) {
					data.slug !== post?.slug && navigate('/dashboard/blog/' + data.slug)
					window.localStorage.removeItem(`dirty-post-${post?.id}`)
				}
			}
		}
	}, [fetcher])

	if (!post) {
		return <h2 className="flex grow items-center justify-center">Not found</h2>
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
			slug:
				postState.slug ||
				generateSlug(postState.title || `Post-${now}`, {
					fallbackPrefix: 'post',
				}),
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
			action: '/dashboard/blog/resource',
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
				action: '/dashboard/blog/resource',
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
		<DashboardSectionWrapper className="items-center">
			{/* Delete post alert */}
			<PostDeleteAlert
				open={deleteAlertOpen}
				onOpenChange={setDeleteAlertOpen}
				post={post}
				handleDelete={handleDelete}
				isDeleting={isDeleting}
				isNavigating={isNavigating}
			/>

			<div className="fixed bottom-8 z-10 flex items-center rounded-full border bg-white/10 p-1 shadow-md ring-1 ring-black/5 backdrop-blur-sm">
				{/* Preview */}
				{post.status !== 'PUBLISHED' ? (
					<Button variant={'link'} asChild disabled={isDirty}>
						<Link to={`/blog/${post.slug}?preview=true`} target="_blank">
							Preview post
							<ExternalLink size={12} />
						</Link>
					</Button>
				) : (
					<Link to={`/blog/${post.slug}`} target="_blank">
						<Button variant={'link'} size={'sm'}>
							View post
							<ExternalLink className="!size-3" />
						</Button>
					</Link>
				)}

				{/* Discard */}
				{isDirty && (
					<Button
						size={'sm'}
						variant={'ghost'}
						className="text-destructive hover:bg-destructive rounded-full"
						onClick={handleDiscard}
					>
						<Trash height={16} width={16} />
						<p className="text-xs">Discard</p>
					</Button>
				)}

				{/* Save */}
				<Button
					type="submit"
					size={'sm'}
					variant={'ghost'}
					className="rounded-full"
					disabled={!isDirty || isSubmitting}
					onClick={handleSave}
				>
					{isSaving && <Loader2 size={16} className="animate-spin" />}
					<p className="text-xs">Save</p>
				</Button>

				{/* Open settings */}
				<Button
					className="ml-1 rounded-full"
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
				categories={categories.filter(c => !c.parentId)}
				isDirty={isDirty}
				setIsDirty={setIsDirty}
				onSave={handleSave}
				onDeleteRequest={() => setDeleteAlertOpen(true)}
			/>
		</DashboardSectionWrapper>
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
						<span className="text-primary font-bold">{post.title}</span> (id:{' '}
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
