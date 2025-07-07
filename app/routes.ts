import { route, type RouteConfig } from '@react-router/dev/routes'

import { dashboardPage } from './routes/papa/dashboard/routes'
import { servicesRoutes } from './routes/papa/utils/get-service-configs'
import { webPage } from './routes/web/routes'

const systemRoutes = [
	...webPage(),

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

export default [...systemRoutes]
