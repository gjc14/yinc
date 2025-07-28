import { useNavigate } from 'react-router'

import { useAtom } from 'jotai'
import { ExternalLink, Loader2, RotateCcw, Settings } from 'lucide-react'

import { Button } from '~/components/ui/button'

import {
	hasChangesAtom,
	isResetAlertOpenAtom,
	isSavingAtom,
	isSettingsOpenAtom,
	postAtom,
} from '../context'

export const FloatingTools = ({
	onSave,
	isCreate,
}: {
	onSave: () => void
	isCreate: boolean
}) => {
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
			{!isCreate && (
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
			)}

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
				<p className="text-xs">{isCreate ? 'Create' : 'Save'}</p>
			</Button>

			{/* Open settings */}
			<Button
				className="ml-1 size-8 rounded-full"
				size={'icon'}
				onClick={() => setIsSettingsOpen(p => !p)}
			>
				<Settings />
			</Button>
		</div>
	)
}
