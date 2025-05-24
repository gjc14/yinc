import { route, type RouteConfig } from '@react-router/dev/routes'

import { adminPage } from './routes/papa/admin/routes'
import { webPage } from './routes/web/routes'

const systemRoutes = [
	...webPage(),

	// Auth API
	route('/api/auth/*', './routes/auth.ts'),

	// PAPA assets resource route
	route('assets/:assetId', './routes/papa/assets/route.tsx'),
	route('assets/error', './routes/papa/assets/error.tsx'),

	// Auth Page
	route('/admin/portal', './routes/papa/auth/portal.tsx'),

	// Admin route
	...adminPage(),

	// SEO
	route('/robots.txt', './routes/_robots.txt.ts'),
	route('/sitemap.xml', './routes/_sitemap.xml.ts'),
] satisfies RouteConfig

export default [...systemRoutes]
// export default [...systemRoutes, ...otherPluginRoutes]
