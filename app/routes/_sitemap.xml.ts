/**
 * @see https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap
 */
import type { LoaderFunctionArgs } from 'react-router'

import { getPosts } from '~/lib/db/post.server'

import { siteRoutes } from './web/components/footer'

export const toXmlSitemap = (pages: { url: string; lastmod: Date }[]) => {
	// TODO: Add lastmod
	const urlsAsXml = pages
		.map(
			page =>
				`<url><loc>${page.url}</loc><lastmod>${page.lastmod
					.toISOString()
					.replace(/\.\d{3}Z$/, '+00:00')}</lastmod></url>`,
		)
		.join('\n')

	return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      >
        ${urlsAsXml}
      </urlset>`
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// TODO: Add cache control
	// TODO: Add routes from routes.ts
	const url = new URL(request.url)

	const { posts } = await getPosts({
		status: 'PUBLISHED',
	})

	const sitemap = toXmlSitemap([
		{
			url: `${url.origin}`,
			lastmod: new Date(),
		},
		...siteRoutes.map(to => ({
			url: `${url.origin}${to}`,
			lastmod: new Date(),
		})),
		{
			url: `${url.origin}/blog`,
			lastmod: new Date(),
		},
		...posts.map(post => ({
			url: `${url.origin}/blog/${post.slug}`,
			lastmod: post.updatedAt,
		})),
	])

	try {
		return new Response(sitemap, {
			status: 200,
			headers: {
				'Content-Type': 'application/xml',
				'X-Content-Type-Options': 'nosniff',
				'Cache-Control': 'public, max-age=3600',
			},
		})
	} catch (e) {
		throw new Response('', { status: 500, statusText: 'Internal Server Error' })
	}
}
