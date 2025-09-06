import { useNavigate } from 'react-router'

import { useAtom } from 'jotai'
import { ExternalLink, Loader2, RotateCcw, Settings } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { useIsMobile } from '~/hooks/use-mobile'

import {
	hasChangesAtom,
	isResetAlertOpenAtom,
	isSavingAtom,
	isSettingsOpenAtom,
	postAtom,
} from '../context'

export const FloatingToolbar = ({
	onSave,
	isCreate,
}: {
	onSave: () => void
	isCreate: boolean
}) => {
	const isMobile = useIsMobile()
	const navigate = useNavigate()
	const [hasChanges] = useAtom(hasChangesAtom)

	const [post] = useAtom(postAtom)
	const [isSaving] = useAtom(isSavingAtom)
	const [, setIsSettingsOpen] = useAtom(isSettingsOpenAtom)
	const [, setIsResetAlertOpen] = useAtom(isResetAlertOpenAtom)

	if (!post) return null

	return (
		<div
			className={`absolute ${isMobile ? 'bottom-12' : 'bottom-8'} left-1/2 z-10 mx-auto flex w-fit -translate-x-1/2 items-center gap-1 rounded-full border bg-white/50 py-1 pr-1 pl-1.5 shadow-md ring-1 ring-black/5 backdrop-blur-sm dark:bg-black/50`}
		>
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
				variant={'destructive'}
				className="hover:text-destructive rounded-full border border-transparent hover:border-current hover:bg-transparent"
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
				variant={'default'}
				className="hover:text-primary rounded-full border border-transparent hover:border-current hover:bg-transparent"
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
