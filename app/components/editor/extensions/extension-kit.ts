import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import ImageBlock from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'

// import { SlashCommand } from './slash-command'
import { ColorHighlighter } from './color-highlighter'
import { Youtube } from './responseive-youtube'
import { SmilieReplacer } from './smilie-replacer'
import { StreamView } from './stream-view'

/**
 * ExtensionKit
 * @param openOnClick - Open link on click
 */
export const ExtensionKit = ({
	openOnClick = false,
}: {
	openOnClick?: boolean
} = {}) => {
	return [
		StarterKit.configure({
			heading: {
				levels: [2, 3, 4, 5],
			},
			codeBlock: false,
			dropcursor: {
				width: 2,
				class: 'ProseMirror-dropcursor border-black',
			},
		}),

		// Marks
		Underline,
		Highlight.configure({
			multicolor: true,
		}),
		Color,
		Superscript,
		Subscript,
		Link.configure({
			openOnClick: openOnClick,
			autolink: true,
			defaultProtocol: 'https',
			validate: href => /^https?:\/\//.test(href),
		}),
		Typography, // Input rules, such as (c) -> © or >> -> »

		// Nodes
		Placeholder.configure({
			// placeholder: () => {
			// 	return 'Press "/" to open commands, "/ai" for continue writing'
			// },
		}),
		TextAlign.configure({ types: ['heading', 'paragraph'] }),
		TextStyle.configure({}),
		CodeBlockLowlight.configure({ lowlight: createLowlight(common) }),
		ImageBlock.configure({
			inline: true,
			HTMLAttributes: {
				class: 'inline-block',
			},
		}),
		Youtube.configure({
			inline: true,
		}),
		TaskList,
		TaskItem.configure({
			nested: true,
		}),

		// Plugins
		// SlashCommand,
		SmilieReplacer,
		ColorHighlighter,
		StreamView,
	]
}

export default ExtensionKit
