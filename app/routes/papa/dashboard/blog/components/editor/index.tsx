/**
 * PostEditor uses Jotai, should be placed in <Provider> context.
 */
import './styles.css'
import './styles/image-node.css'

import { useCallback, useEffect, useMemo } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { useAtom } from 'jotai'
import debounce from 'lodash/debounce'

import { ExtensionKit } from '~/components/editor/extensions/extension-kit'

import { editorAtom, editorContentAtom, serverPostAtom } from '../../context'

export function ContentEditor() {
	const [serverPost] = useAtom(serverPostAtom)
	const [, setEditor] = useAtom(editorAtom)
	const [, setEditorContent] = useAtom(editorContentAtom)

	// Content realtime update for hasChanges check
	const debouncedSetEditorContent = useMemo(
		() =>
			debounce((content: string) => {
				setEditorContent(content)
			}, 300), // 300ms delay
		[setEditorContent],
	)

	useEffect(() => {
		return () => {
			debouncedSetEditorContent.cancel()
		}
	}, [debouncedSetEditorContent])

	const editor = useEditor({
		immediatelyRender: false,
		extensions: ExtensionKit(),
		content: serverPost?.content ? JSON.parse(serverPost.content) : undefined,
		editorProps: {
			attributes: {
				class: 'mt-6 prose-article focus:outline-hidden',
			},
		},
		onCreate(props) {
			setEditor(props.editor)
			props.editor.commands.focus(1)
		},
		onUpdate(props) {
			const jsonContent = props.editor.getJSON()
			debouncedSetEditorContent(JSON.stringify(jsonContent))
		},
		onDestroy() {
			// Clean up editor in jotai to prevent access before next mount, e.g. when navigating away and back
			setEditor(null)
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
	})

	useEffect(() => {
		editor?.commands.setContent(
			serverPost?.content ? JSON.parse(serverPost.content) : undefined,
		)
	}, [serverPost])

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

	// Handle shortcut keys
	const handleKeyDown = (e: React.KeyboardEvent) => {
		e.stopPropagation() // prevent passing e out e.g. mod+b will only bold rather than toggle sidebar as well
		// e.preventDefault() // TBD. prevent like mod+s save, mod+p print, or mod+r refres
	}

	return <EditorContent editor={editor} onKeyDown={handleKeyDown} />
}
