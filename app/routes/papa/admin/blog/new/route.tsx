import { useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher, useNavigate, useNavigation } from 'react-router'

import { Loader2, Menu, PlusCircle, Trash } from 'lucide-react'

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
import { FullScreenLoading } from '~/components/loading'
import type { PostWithRelations } from '~/lib/db/post.server'
import { PostStatus, user as userTable } from '~/lib/db/schema'
import { type ConventionalActionResponse } from '~/lib/utils'
import { generateSlug } from '~/lib/utils/seo'
import { useAdminBlogContext } from '~/routes/papa/admin/blog/layout'
import { AdminSectionWrapper } from '~/routes/papa/admin/components/admin-wrapper'

import { PostContent, type PostContentHandle } from '../components/post-content'

export default function AdminNewPost() {
	const fetcher = useFetcher<ConventionalActionResponse<{ slug: string }>>()
	const navigate = useNavigate()
	const navigation = useNavigation()

	const { tags, categories, admin } = useAdminBlogContext()

	const postContentRef = useRef<PostContentHandle>(null)
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
			const { err, data } = fetcher.data
			if (!err) {
				navigate(`/admin/blog/${data?.slug}`)
			} else {
				console.error('Error creating post:', err)
			}
		}
	}, [fetcher])

	const handleCreate = () => {
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
			method: 'POST', // Create
			encType: 'application/json',
			action: '/admin/blog/resource',
		})

		setIsDirty(false)
		window.localStorage.removeItem(`dirty-post-${-1}`)
	}

	const handleDiscard = () => {
		postContentRef.current?.resetPost()
	}

	return (
		<AdminSectionWrapper
			className={`items-center pt-16 md:pt-12 ${isNavigating ? 'overflow-hidden' : ''}`}
		>
			{isNavigating && <FullScreenLoading contained />}

			<div className="z-10 fixed top-16 right-6 flex items-center gap-2">
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
					disabled={!isDirty}
					onClick={handleCreate}
				>
					{isSubmitting ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<PlusCircle size={16} />
					)}
					<p className="text-xs">{isSubmitting ? 'Creating...' : 'Create'}</p>
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
				onSave={handleCreate}
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
