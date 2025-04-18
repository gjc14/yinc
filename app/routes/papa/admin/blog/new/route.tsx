import { useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher, useNavigate, useNavigation } from 'react-router'

import { Loader2, PlusCircle, Settings, Trash } from 'lucide-react'

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
import { PostStatus, user as userTable } from '~/lib/db/schema'
import { generateSlug } from '~/lib/utils/seo'
import { useAdminBlogContext } from '~/routes/papa/admin/blog/layout'
import { AdminSectionWrapper } from '~/routes/papa/admin/components/admin-wrapper'

import { PostComponent, type PostHandle } from '../components/post-component'
import type { action } from '../resource'

export default function AdminNewPost() {
	const fetcher = useFetcher<typeof action>()
	const navigate = useNavigate()
	const navigation = useNavigation()

	const { tags, categories, admin } = useAdminBlogContext()

	const postContentRef = useRef<PostHandle>(null)
	const [isDirty, setIsDirty] = useState(false)

	const post = useMemo(
		() =>
			generateNewPost({
				...admin,
				image: admin.image || null,
				role: admin.role || null,
				banned: admin.banned || null,
				banReason: admin.banReason || null,
				banExpires: admin.banExpires || null,
			}),
		[admin],
	)

	const isSubmitting = fetcher.state === 'submitting'
	const isNavigating = navigation.state === 'loading'

	useEffect(() => {
		if (fetcher.state === 'loading' && fetcher.data) {
			const { data } = fetcher.data
			if (data) {
				navigate(`/admin/blog/${data.slug}`)
				window.localStorage.removeItem(`dirty-post-${-1}`)
			}
		}
	}, [fetcher])

	const handleCreate = () => {
		const postState = postContentRef.current?.getPostState()
		if (!postState || !isDirty || isSubmitting || isNavigating) return

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
			method: 'POST', // Create
			encType: 'application/json',
			action: '/admin/blog/resource',
		})

		setIsDirty(false)
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
			<div className="z-10 fixed top-16 right-6 flex items-center gap-2">
				{/* Discard */}
				<AlertDialog>
					{isDirty ||
						(false && (
							<AlertDialogTrigger asChild>
								<Button size={'sm'} variant={'destructive'}>
									<Trash height={16} width={16} />
									<p className="text-xs">Discard</p>
								</Button>
							</AlertDialogTrigger>
						))}
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Discard Post</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to discard this post?
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

				{/* Create */}
				<Button
					type="submit"
					size={'sm'}
					disabled={!isDirty || isSubmitting || isNavigating}
					onClick={handleCreate}
				>
					{isSubmitting || (isNavigating && fetcher.data) ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<PlusCircle size={16} />
					)}
					<p className="text-xs">
						{isNavigating && fetcher.data
							? 'Redirecting...'
							: isSubmitting
								? 'Creating...'
								: 'Create'}
					</p>
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
				onSave={handleCreate}
				onDeleteRequest={() => {}}
			/>
		</AdminSectionWrapper>
	)
}

const generateNewPost = (
	user: typeof userTable.$inferSelect,
): PostWithRelations => {
	const now = new Date()
	return {
		id: -1,
		createdAt: now,
		updatedAt: now,
		title: '',
		slug: '',
		content: null,
		excerpt: null,
		featuredImage: null,
		status: PostStatus[0],
		authorId: user.id,
		author: user,
		tags: [],
		categories: [],
		seo: {
			id: -1,
			createdAt: now,
			updatedAt: now,
			metaTitle: null,
			metaDescription: null,
			keywords: null,
			ogImage: null,
			autoGenerated: true,
			route: null,
			postId: null,
		},
	}
}
