import DefaultYoutube from '@tiptap/extension-youtube'
import { mergeAttributes } from '@tiptap/react'

import { getEmbedUrlFromYoutubeUrl } from './utils'

const Youtube = DefaultYoutube.extend({
	renderHTML({ HTMLAttributes }) {
		if (HTMLAttributes.src && !HTMLAttributes.src.includes('/embed/')) {
			HTMLAttributes.src = getEmbedUrlFromYoutubeUrl({
				...this.options,
				url: HTMLAttributes.src,
			})
		}

		return [
			'div',
			{
				class: 'youtube-wrapper',
				style: 'position: relative; width: 100%; padding-bottom: 56.25%;', // 16:9 aspect ratio
			},

			[
				'iframe',
				mergeAttributes(
					{
						style:
							'position: absolute; top: 0; left: 0; width: 100%; height: 100%;',
					},
					this.options.HTMLAttributes,
					{
						...this.options,
					},
					HTMLAttributes,
				),
			],
		]
	},
})

export { Youtube }
