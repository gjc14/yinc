import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { useEditorState } from '@tiptap/react'
import { atom, useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { CloudAlert, Image, Loader } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { defaultValidUrlProtocols, isValidUrl } from '~/lib/utils'
import { FileGrid } from '~/routes/papa/dashboard/assets/components/file-grid'

import { editorAtom } from '../../../context'
import { useAssetsContext } from '../../../hooks'
import { createImageOption } from '../edit-options'
import { TooltipWrapper } from './tooltip-wrapper'

export const isImageSelectorOpenAtom = atom(false)

export const ImageButton = () => {
	const IMAGE_SHORTCUT = createImageOption({ src: '' }).shortcut
	const [srcInput, setSrcInput] = useState('')
	const [altInput, setAltInput] = useState('')
	const [titleInput, setTitleInput] = useState('')

	const [imageLoading, setImageLoading] = useState(false)
	const [imageError, setImageError] = useState(false)
	const [currentLoadingSrc, setCurrentLoadingSrc] = useState('')

	useHydrateAtoms([[isImageSelectorOpenAtom, false]])

	const [editor] = useAtom(editorAtom)
	const [isImageSelectorOpen, setIsImageSelectorOpen] = useAtom(
		isImageSelectorOpenAtom,
	)

	/**
	 * The selector function allows you to specify which parts of the editor state you want to subscribe to.
	 * @see https://tiptap.dev/docs/guides/performance#use-useeditorstate-to-prevent-unnecessary-re-renders
	 */
	const imageStates = useEditorState({
		editor,
		selector: ctx => {
			const { editor } = ctx
			if (!editor) return

			// log to help debug whether the selector thinks the command can run / is active
			const opt = createImageOption({ src: srcInput })
			const isActive = opt.isActive(editor)
			const canRun = opt.canRun(editor)
			return { isActive, canRun }
		},
	})

	const isActive = imageStates?.isActive
	const canRun = imageStates?.canRun

	const validSrcInput =
		srcInput.startsWith('/assets') ||
		isValidUrl(srcInput, [...defaultValidUrlProtocols, 'blob:'])

	const insertAvailable = validSrcInput && canRun

	// Open Image selector
	useHotkeys(
		IMAGE_SHORTCUT,
		e => {
			setIsImageSelectorOpen(prev => !prev)
			e.preventDefault()
			e.stopPropagation()
		},
		{
			enabled: canRun,
			enableOnContentEditable: true,
			enableOnFormTags: true,
		},
	)

	useEffect(() => {
		if (validSrcInput && srcInput !== currentLoadingSrc) {
			setImageLoading(true)
			setImageError(false)
			setCurrentLoadingSrc(srcInput)
		} else if (!validSrcInput) {
			setImageLoading(false)
			setImageError(false)
			setCurrentLoadingSrc('')
		}
	}, [srcInput, currentLoadingSrc])

	if (!editor) return <Skeleton className="size-8" />

	const setSrc = () => {
		try {
			if (!srcInput) return
			editor
				.chain()
				.setImage({ src: srcInput, alt: altInput, title: titleInput })
				.run()
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error unsetting image:', error.message)
			} else {
				console.error('Unexpected error unsetting image:', error)
			}
		}
	}

	const handleImageLoad = () => {
		setImageLoading(false)
		setImageError(false)
	}

	const handleImageError = () => {
		setImageLoading(false)
		setImageError(true)
	}

	return (
		<Dialog
			open={isImageSelectorOpen}
			onOpenChange={open => {
				setIsImageSelectorOpen(open)

				if (open) {
					const { src, alt, title } = editor.getAttributes('image')
					setSrcInput(src || '')
					setAltInput(alt || '')
					setTitleInput(title || '')
				} else {
					editor.commands.focus()
				}
			}}
		>
			<TooltipWrapper tooltip="Image" shortcut={IMAGE_SHORTCUT}>
				<DialogTrigger asChild>
					<Button
						size={'icon'}
						variant={'ghost'}
						className={`h-8 w-8 ${isActive ? 'bg-accent text-accent-foreground' : ''}`}
						disabled={!canRun}
					>
						<Image size={14} />
					</Button>
				</DialogTrigger>
			</TooltipWrapper>
			<DialogContent
				className="max-h-[90vh] overflow-scroll"
				onCloseAutoFocus={e => e.preventDefault()}
			>
				<DialogTitle hidden>Add Image</DialogTitle>
				<DialogDescription hidden></DialogDescription>
				<div className="flex flex-col items-center gap-3">
					{/* Preview */}
					<section
						className={`flex h-40 w-full items-center justify-center border backdrop-blur-md`}
					>
						{insertAvailable ? (
							<>
								<img
									src={srcInput}
									alt={altInput}
									title={titleInput}
									className={`max-h-40 object-contain transition-opacity ${
										imageLoading ? 'hidden' : 'opacity-100'
									}`}
									onLoad={handleImageLoad}
									onError={handleImageError}
								/>
								{imageLoading && <Loader className="animate-spin" />}
								{imageError && <>❌</>}
							</>
						) : (
							<>🍌</>
						)}
					</section>

					{/* Inputs */}
					<section className="flex w-full flex-col gap-2">
						<div className="w-full">
							<Label htmlFor="image-src">Image URL *</Label>
							<Input
								id="image-src"
								value={srcInput}
								onChange={e => setSrcInput(e.target.value)}
								placeholder="https://example.com/image.webp"
							/>
						</div>

						<div className="w-full">
							<Label htmlFor="image-alt">Image Alt Text </Label>
							<Input
								id="image-alt"
								value={altInput}
								onChange={e => setAltInput(e.target.value)}
								placeholder="My Image Alt Text"
							/>
						</div>

						<div className="w-full">
							<Label htmlFor="image-title">Image Title </Label>
							<Input
								id="image-title"
								value={titleInput}
								onChange={e => setTitleInput(e.target.value)}
								placeholder="My Image"
							/>
						</div>
					</section>

					<Separator />

					<AssetGallery
						onSelect={({ src, alt, title }) => {
							setSrcInput(src)
							setAltInput(alt || '')
							setTitleInput(title)
						}}
					/>

					<DialogClose asChild>
						<Button
							onClick={setSrc}
							className="mt-2 w-full"
							disabled={!insertAvailable}
						>
							Insert
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function AssetGallery({
	onSelect,
}: {
	onSelect: (args: { src: string; alt: string | null; title: string }) => void
}) {
	const { files, origin, hasObjectStorage, isLoading } = useAssetsContext()

	if (isLoading) {
		return (
			<div className="text-muted-foreground flex w-full flex-1 flex-col items-center justify-center gap-2 rounded-xl border px-2 py-5">
				<Loader className="animate-spin" />
				<p className="max-w-sm text-center text-sm">
					Loading your assets, please wait a second.
				</p>
			</div>
		)
	} else if (hasObjectStorage) {
		return (
			<FileGrid
				files={files}
				origin={origin}
				onFileSelect={file => {
					onSelect({
						src: `/assets/${file.id}`,
						alt: file.description,
						title: file.name,
					})
				}}
				cardSize="lg"
			/>
		)
	} else {
		return (
			<div className="text-muted-foreground flex w-full flex-1 flex-col items-center justify-center gap-2 rounded-xl border px-2 py-5">
				<CloudAlert size={30} />
				<p className="max-w-sm text-center text-sm">
					Please setup your S3 Object Storage to start using assets.
				</p>
			</div>
		)
	}
}
