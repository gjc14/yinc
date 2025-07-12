import type { SitemapURL } from '../to-xml-url-tags'
import { getServiceRoutesModules } from './helpers'

export const getSitemapUrls = (url: URL): SitemapURL[] => {
	const modules = getServiceRoutesModules()
	let urls: SitemapURL[] = []

	console.log(
		`Processing service modules for sitemap URLs: ${Object.keys(modules).join(', ')}`,
	)

	/**
	 * Automatically includes all service routes without manual imports
	 */
	for (const [path, service] of Object.entries(modules)) {
		console.log(`Processing service at ${path}`)
		try {
			if (!service.sitemap) continue

			urls = urls.concat(
				typeof service.sitemap === 'function'
					? service.sitemap(url)
					: service.sitemap,
			)
		} catch (error) {
			console.error(`Failed to load sitemap config from ${path}:`, error)
		}
	}

	return urls
}
