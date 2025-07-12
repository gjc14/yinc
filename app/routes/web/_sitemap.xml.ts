/**
 * @see https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap
 * @see https://www.sitemaps.org/protocol.html
 */
import type { LoaderFunctionArgs } from 'react-router'

import { db } from '~/lib/db/db.server'

import { getWebFallbackRoutes } from '../papa/utils/service-configs'
import { toXmlUrlTagss, type SitemapURL } from '../papa/utils/to-xml-url-tags'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const origin = new URL(request.url).origin

	const urlTags = toXmlUrlTagss([
		{
			loc: origin,
			lastmod: new Date(),
		},
		...(await getBlogSitemapUrls(origin)),
	])

	try {
		return new Response(
			`<?xml version="1.0" encoding="UTF-8"?>
				<urlset
					xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
				>
					${urlTags.join('\n')}
				</urlset>`,
			{
				status: 200,
				headers: {
					'Content-Type': 'application/xml',
					'X-Content-Type-Options': 'nosniff',
					'Cache-Control': 'public, max-age=3600',
				},
			},
		)
	} catch (e) {
		console.error('Error generating sitemap:', e)
		throw new Response('', { status: 500 })
	}
}

async function getBlogSitemapUrls(origin: string): Promise<SitemapURL[]> {
	const urls: SitemapURL[] = []

	const { shouldIncludeBlog } = getWebFallbackRoutes()

	if (shouldIncludeBlog) {
		const posts = await db.query.post.findMany({
			where(fields, { eq }) {
				return eq(fields.status, 'PUBLISHED')
			},
			columns: {
				slug: true,
				updatedAt: true,
			},
		})

		urls.push({ loc: `${origin}/blog`, lastmod: new Date() })
		for (const post of posts) {
			urls.push({
				loc: `${origin}/blog/${post.slug}`,
				lastmod: post.updatedAt,
			})
		}
	}

	return urls
}
