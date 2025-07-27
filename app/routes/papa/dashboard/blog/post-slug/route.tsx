import { useEffect } from 'react'
import { useFetcher, useNavigate, useNavigation } from 'react-router'

import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import {
	ExternalLink,
	HeartCrack,
	Loader2,
	RotateCcw,
	Settings,
} from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Loading } from '~/components/loading'
import { useIsMobile } from '~/hooks/use-mobile'
import { generateSlug } from '~/lib/utils/seo'
import { Post } from '~/routes/web/blog/components/post'

import type { Route } from '../+types/layout'
import { ContentEditor } from '../components/editor'
import { Toolbar } from '../components/editor/editor-toolbar'
import { PostDeleteAlert } from '../components/post/delete-alert'
import { LocalStorageCheck } from '../components/post/local-storage-check'
import { PostSettings } from '../components/post/post-settings'
import { PostResetAlert } from '../components/post/reset-alert'
import {
	categoriesAtom,
	editorAtom,
	hasChangesAtom,
	isDeletingAtom,
	isResetAlertOpenAtom,
	isSavingAtom,
	isSettingsOpenAtom,
	postAtom,
	serverPostAtom,
	tagsAtom,
} from '../context'
import type { action } from '../resource'

export default function DashboardSlugPost({
	matches,
	params,
}: Route.ComponentProps) {
	const blogMatch = matches[2]
	const { tags, categories, posts } = blogMatch.data
	const currentPost = posts.find(p => p.slug === params.postSlug)

	useHydrateAtoms([
		[serverPostAtom, currentPost],
		[postAtom, currentPost],
		[tagsAtom, tags],
		[categoriesAtom, categories],

		[isSavingAtom, false],
		[isDeletingAtom, false],
	])

	const [editor] = useAtom(editorAtom)

	const isMobile = useIsMobile()
	const fetcher = useFetcher<typeof action>()
	const navigate = useNavigate()
	const navigation = useNavigation()

	const isSubmitting = fetcher.state === 'submitting'
	const isNavigating = navigation.state === 'loading'

	const [post, setPost] = useAtom(postAtom)
	const [, setServerPost] = useAtom(serverPostAtom)
	const [hasChanges] = useAtom(hasChangesAtom)

	const [isSaving, setIsSaving] = useAtom(isSavingAtom)
	const [isDeleting, setIsDeleting] = useAtom(isDeletingAtom)

	useEffect(() => {
		setPost(currentPost)
		setServerPost(currentPost)
	}, [params.postSlug, setPost])

	useEffect(() => {
		setIsSaving(isSubmitting && fetcher.formMethod === 'PUT')
		setIsDeleting(isSubmitting && fetcher.formMethod === 'DELETE')

		if (fetcher.state === 'loading' && fetcher.data) {
			if (fetcher.formMethod === 'DELETE' && 'data' in fetcher.data) {
				fetcher.data.data && navigate('/dashboard/blog')
			}
			if (fetcher.formMethod === 'PUT' && 'data' in fetcher.data) {
				const data = fetcher.data.data
				if (data) {
					data.slug !== post?.slug && navigate('/dashboard/blog/' + data.slug)
					window.localStorage.removeItem(`dirty-post-${post?.id}`)
				}
			}
		}
	}, [fetcher.state, fetcher.formMethod, isSubmitting])

	if (isNavigating) {
		return (
			<div className="mx-auto flex h-full flex-1 flex-col items-center justify-center space-y-6">
				<Loading />
			</div>
		)
	}

	if (!post) {
		return (
			<div className="mx-auto flex h-full flex-1 flex-col items-center justify-center space-y-6">
				<HeartCrack className="size-36" />
				<h2>Post Not found</h2>
			</div>
		)
	}

	// Handle database save
	const handleSave = () => {
		if (
			!post ||
			!editor ||
			!hasChanges ||
			isSaving ||
			isDeleting ||
			isSubmitting ||
			isNavigating
		)
			return

		const now = new Date().toISOString().replace(/T/, '@').split('.')[0]

		// Remove date fields and set default values
		const postReady = {
			...post,
			title: post.title || `p-${now}`,
			slug:
				post.slug ||
				generateSlug(post.title || `p-${now}`, {
					fallbackPrefix: 'post',
					prevent: ['new'],
				}),
			content: JSON.stringify(editor.getJSON()),
			createdAt: undefined,
			updatedAt: undefined,
			seo: {
				...post.seo,
				createdAt: undefined,
				updatedAt: undefined,
			},
		}

		fetcher.submit(JSON.stringify(postReady), {
			method: 'PUT', // Update
			encType: 'application/json',
			action: '/dashboard/blog/resource',
		})
	}

	// Handle database delete
	const handleDelete = async () => {
		if (!post || isSubmitting) return

		fetcher.submit(
			{ id: post.id },
			{
				method: 'DELETE',
				action: '/dashboard/blog/resource',
				encType: 'application/json',
			},
		)
	}

	// Handle post reset
	const handleReset = () => {
		setPost(currentPost)
		editor?.commands.setContent(
			currentPost?.content ? JSON.parse(currentPost.content) : undefined,
		)
	}

	return (
		<div className="relative h-full overflow-hidden">
			{/* Editor toolbar self positioning */}
			<Toolbar isMobile={isMobile} />
			<FloatingTools onSave={handleSave} />

			<LocalStorageCheck />
			<PostResetAlert onReset={handleReset} />
			<PostDeleteAlert onDelete={handleDelete} />

			<PostSettings />

			{/* Main Content Section */}
			<section
				className={`relative h-full overflow-y-auto py-6 ${isMobile ? 'pb-16' : 'pt-16'}`}
			>
				<div className="mx-auto w-full max-w-prose px-3">
					<Post
						post={post}
						editable
						onTitleChange={title => {
							setPost({
								...post,
								title,
							})
						}}
					>
						<ContentEditor />
					</Post>
				</div>
			</section>
		</div>
	)
}

const FloatingTools = ({ onSave }: { onSave: () => void }) => {
	const navigate = useNavigate()
	const [hasChanges] = useAtom(hasChangesAtom)

	const [post] = useAtom(postAtom)
	const [isSaving] = useAtom(isSavingAtom)
	const [, setIsSettingsOpen] = useAtom(isSettingsOpenAtom)
	const [, setIsResetAlertOpen] = useAtom(isResetAlertOpenAtom)

	if (!post) return null

	return (
		<div className="absolute bottom-8 left-1/2 z-10 mx-auto flex w-fit -translate-x-1/2 items-center rounded-full border bg-white/50 p-1 shadow-md ring-1 ring-black/5 backdrop-blur-sm">
			{/* Preview */}
			<Button
				variant={'link'}
				size={'sm'}
				className="text-xs"
				disabled={hasChanges}
				onClick={() =>
					navigate(
						`/blog/${post.slug}${post.status !== 'PUBLISHED' ? '?preview=true' : ''}`,
					)
				}
			>
				{post.status !== 'PUBLISHED' ? 'Preview post' : 'View post'}
				<ExternalLink className="size-3!" />
			</Button>

			{/* Discard */}
			<Button
				size={'sm'}
				variant={'ghost'}
				className="text-destructive hover:bg-destructive rounded-full hover:text-white"
				disabled={!hasChanges || isSaving}
				onClick={() => setIsResetAlertOpen(true)}
			>
				<RotateCcw className="size-4" />
				<p className="text-xs">Reset</p>
			</Button>

			{/* Save */}
			<Button
				type="submit"
				size={'sm'}
				variant={'ghost'}
				className="hover:bg-primary hover:text-primary-foreground rounded-full"
				disabled={!hasChanges || isSaving}
				onClick={onSave}
			>
				{isSaving && <Loader2 size={16} className="animate-spin" />}
				<p className="text-xs">Save</p>
			</Button>

			{/* Open settings */}
			<Button
				className="ml-1 rounded-full"
				size={'icon'}
				onClick={() => setIsSettingsOpen(p => !p)}
			>
				<Settings />
			</Button>
		</div>
	)
}
