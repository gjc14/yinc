import 'highlight.js/styles/base16/atelier-dune.min.css'
import './styles.scss'

import { forwardRef, useCallback, useImperativeHandle } from 'react'

// import { DefaultFloatingMenu } from '../components/menus/floating-menu'
import { Editor, EditorContent, useEditor } from '@tiptap/react'

import { cn } from '~/lib/utils'

import { Loading } from '../loading'
import { DefaultBubbleMenu } from './components/menus/bubble-menu'
import { MenuBar } from './components/menus/menu-bar'
import ExtensionKit from './extensions/extension-kit'

export interface EditorRef {
	editor: Editor | null
}

interface EditorProps {
	content?: string
	onUpdate?: ({
		toJSON,
		toHTML,
		toText,
	}: {
		toJSON: () => string
		toHTML: () => string
		toText: () => string
	}) => void
	onFocus?: () => void
	onBlur?: () => void
	onSave?: () => void
	className?: string
	menuBarClassName?: string
	editorContentClassName?: string
}

export default forwardRef<EditorRef, EditorProps>((props, ref) => {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [...ExtensionKit()],
		content: props.content ? JSON.parse(props.content) : undefined,
		onFocus: () => {
			props.onFocus && props.onFocus()
		},
		onBlur: () => {
			props.onBlur && props.onBlur()
		},
		onUpdate({ editor }) {
			props.onUpdate &&
				props.onUpdate({
					toJSON: () => JSON.stringify(editor.getJSON()),
					toHTML: () => editor.getHTML(),
					toText: () => editor.getText(),
				})
		},
		async onDrop(e, slice, moved) {
			if (moved) return

			const dataTransfer = e.dataTransfer
			if (!dataTransfer) return

			const files = Array.from(dataTransfer.files)

			if (files.length) {
				e.preventDefault()
				const awaitHandleFiles = files.map(async file => {
					console.log('File dropped:', file)

					switch (file.type.split('/')[0]) {
						case 'image':
							return await handleImageDrop(file)
					}
				})

				await Promise.all(awaitHandleFiles)
			}
		},
		editorProps: {
			attributes: {
				class: 'mt-6 prose-article focus:outline-hidden',
			},
		},
	})

	useImperativeHandle(
		ref,
		() => ({
			editor,
		}),
		[editor],
	)

	/////////////////////////////
	///      Drop Upload      ///
	/////////////////////////////
	const imageBlobMap = new Map<string, File>()
	const handleImageDrop = useCallback(
		async (file: File) => {
			if (!editor) return

			const previewURL = URL.createObjectURL(file)
			console.log('Image file dropped', previewURL)
			// TODO: when saved, loop over post and replace previewURL with URL after upload
			imageBlobMap.set(previewURL, file)

			editor
				.chain()
				.focus()
				.setImage({
					src: URL.createObjectURL(file),
					alt: file.name || 'image',
					title: file.name || 'image',
				})
				.run()
		},
		[imageBlobMap, editor],
	)

	if (!editor) {
		return (
			<div className={cn('flex grow justify-center', props.className)}>
				<Loading className="m-3" />
			</div>
		)
	}

	return (
		<div
			className={cn(
				'relative flex max-w-prose grow flex-col gap-3',
				props.className,
			)}
		>
			<MenuBar editor={editor} className={cn(props.menuBarClassName)} />

			{/* TODO: Many bubble menus like image/youtube/link */}

			<DefaultBubbleMenu editor={editor} />

			{/* <DefaultFloatingMenu editor={editor} /> */}

			{/* Editor part */}
			<EditorContent
				onClick={() => editor?.commands.focus()}
				onKeyDown={e => {
					e.stopPropagation()

					if ((e.metaKey || e.ctrlKey) && e.key === 's') {
						e.preventDefault()
						props.onSave?.()
					}
				}}
				editor={editor}
				className={cn('grow cursor-text', props.editorContentClassName)}
			/>
		</div>
	)
})
