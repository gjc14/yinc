/**
 * PostEditor uses Jotai, should be placed in <Provider> context.
 */
import './styles.css'
import './styles/image-node.css'

import { useCallback, useEffect } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { useAtom } from 'jotai'

import { ExtensionKit } from '~/components/editor/extensions/extension-kit'
import { useNonce } from '~/hooks/use-nonce'

import { editorAtom, editorContentAtom, postAtom } from '../../context'

export function ContentEditor() {
	const [post] = useAtom(postAtom)
	const [, setEditor] = useAtom(editorAtom)
	const [, setEditorContent] = useAtom(editorContentAtom)
	const nonce = useNonce()

	const editor = useEditor({
		immediatelyRender: false,
		extensions: ExtensionKit(),
		content: post?.content ? JSON.parse(post.content) : undefined,
		editorProps: {
			attributes: {
				class: 'mt-6 prose-article focus:outline-hidden',
			},
		},
		onCreate(props) {
			setEditor(props.editor)
			props.editor.commands.focus()
		},
		onUpdate(props) {
			const jsonContent = props.editor.getJSON()
			setEditorContent(JSON.stringify(jsonContent))
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
		injectNonce: nonce,
	})

	useEffect(() => {
		editor?.commands.setContent(
			post?.content ? JSON.parse(post.content) : undefined,
		)
	}, [post])

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
