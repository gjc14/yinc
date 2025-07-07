import { layout, route, type RouteConfig } from '@react-router/dev/routes'

import { dashboardPage } from './routes/papa/dashboard/routes'
import {
	getWebFallbackRoutes,
	servicesRoutes,
} from './routes/papa/utils/get-service-configs'
import { blogRoute, indexRoute, splatRoute } from './routes/web/papa.routes'

// Check what web routes need fallbacks
const webFallbacks = getWebFallbackRoutes()

// Build web routes array based on what's needed as fallback
const webRoutes: RouteConfig = []

if (webFallbacks.shouldIncludeIndex) {
	webRoutes.push(indexRoute())
}

if (webFallbacks.shouldIncludeBlog) {
	webRoutes.push(blogRoute())
}

if (webFallbacks.shouldIncludeSplat) {
	webRoutes.push(splatRoute())
}

export default [
	// Only add layout with web routes if we have any fallback routes needed
	...(webRoutes.length > 0
		? [layout('./routes/web/layout.tsx', webRoutes)]
		: []),

	// Auth API
	route('/api/auth/*', './routes/auth.ts'),

	// PAPA assets resource route
	route('assets/:assetId', './routes/papa/assets/route.tsx'),

	// Auth Page
	route('/dashboard/portal', './routes/papa/auth/portal.tsx'),

	// Dashboard route
	...dashboardPage(),

	// SEO
	route('/robots.txt', './routes/_robots.txt.ts'),
	route('/sitemap.xml', './routes/_sitemap.xml.ts'),

	// Service routes (dynamically loaded)
	...servicesRoutes(),
] satisfies RouteConfig
