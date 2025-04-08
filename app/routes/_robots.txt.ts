/**
 * @see https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt?hl=zh-tw
 */

import type { LoaderFunctionArgs } from 'react-router'

export const loader = ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const robotText = `
        User-agent: Googlebot
        Disallow: /nogooglebot/

        User-agent: *
        Allow: /

        Sitemap: ${url.origin}/sitemap.xml`
		.replace(/^[ \t]+(?=\S)/gm, '')
		.trim()

	return new Response(robotText, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain',
		},
	})
}
