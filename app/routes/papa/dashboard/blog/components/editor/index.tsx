/**
 * PostEditor uses Jotai, should be placed in <Provider> context.
 */
import './styles.css'

import { useCallback } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { useAtom } from 'jotai'

import { ExtensionKit } from '~/components/editor/extensions/extension-kit'

import { editorAtom, postAtom } from '../../context'

export function ContentEditor() {
	const [post] = useAtom(postAtom)
	const [_, setEditor] = useAtom(editorAtom)

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

	return <EditorContent editor={editor} />
}
