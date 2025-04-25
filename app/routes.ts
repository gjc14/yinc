import {
	index,
	layout,
	prefix,
	route,
	type RouteConfig,
} from '@react-router/dev/routes'

import { webPage } from './routes/web/routes'

// import { cv } from './routes/cv/routes'

const systemRoutes = [
	layout('./routes/layout.tsx', [
		layout('./routes/web/layout.tsx', [
			index('./routes/web/index/route.tsx'),
			...prefix('/blog', [
				layout('./routes/web/blog/layout.tsx', [
					index('./routes/web/blog/index/route.tsx'),
					route(':postSlug', './routes/web/blog/post-slug/route.tsx'),
					route(':postSlug/edit', './routes/web/blog/post-slug-edit/route.tsx'),
					route('/category', './routes/web/blog/category/route.tsx'),
					route('/tag', './routes/web/blog/tag/route.tsx'),
					route('/subscribe', './routes/web/blog/subscribe/route.tsx'),
				]),
			]),
			route('/*', './routes/web/$/route.tsx'),

			// Adding customized web routes
			...webPage(),
		]),

		// Auth
		route('/api/auth/*', './routes/auth.ts'),

		// PAPA assets resource route
		route('assets/:assetId', './routes/papa/assets/route.tsx'),
		route('assets/error', './routes/papa/assets/error.tsx'),

		// Auth
		route('/admin/signin', './routes/papa/auth/signin.tsx'),

		// Admin route
		...prefix('/admin', [
			// Admin layout
			layout('./routes/papa/admin/layout.tsx', [
				index('./routes/papa/admin/index/route.tsx'),

				// Admin API
				...prefix('/api', [
					route('/ai/chat', './routes/papa/admin/api/ai-chat/route.tsx'),
				]),
				// Assets
				...prefix('/assets', [
					index('./routes/papa/admin/assets/index.tsx'),
					route('/resource', './routes/papa/admin/assets/resource.ts'),
				]),
				// Account
				...prefix('/account', [
					layout('./routes/papa/admin/account/layout.tsx', [
						index('./routes/papa/admin/account/index/route.tsx'),
						route('/billing', './routes/papa/admin/account/billing/route.tsx'),
						route(
							'/notification',
							'./routes/papa/admin/account/notification/route.tsx',
						),
						route(
							'/security',
							'./routes/papa/admin/account/security/route.tsx',
						),
					]),
				]),
				// Blog
				...prefix('/blog', [
					layout('./routes/papa/admin/blog/layout.tsx', [
						index('./routes/papa/admin/blog/index/route.tsx'),
						route(
							'/generative',
							'./routes/papa/admin/blog/generative/route.tsx',
						),
						route('/new', './routes/papa/admin/blog/new/route.tsx'),
						route('/:postSlug', './routes/papa/admin/blog/post-slug/route.tsx'),
						route('/resource', './routes/papa/admin/blog/resource.ts'),
						...prefix('/taxonomy', [
							index('./routes/papa/admin/blog/taxonomy/index.tsx'),
							route(
								'/resource',
								'./routes/papa/admin/blog/taxonomy/resource.ts',
							),
						]),
					]),
				]),
				// Company
				...prefix('/company', [
					layout('./routes/papa/admin/company/layout.tsx', [
						index('./routes/papa/admin/company/index/route.tsx'),
						route('/billing', './routes/papa/admin/company/billing/route.tsx'),
						route(
							'/notification',
							'./routes/papa/admin/company/notification/route.tsx',
						),
						route(
							'/security',
							'./routes/papa/admin/company/security/route.tsx',
						),
					]),
				]),
				// SEO
				...prefix('/seo', [
					index('./routes/papa/admin/seo/index.tsx'),
					route('/resource', './routes/papa/admin/seo/resource.ts'),
				]),
				...prefix('/users', [
					index('./routes/papa/admin/users/index.tsx'),
					route('/resource', './routes/papa/admin/users/resource.ts'),
				]),
				...prefix('/admins', [
					index('./routes/papa/admin/admins/index.tsx'),
					route('/resource', './routes/papa/admin/admins/resource.ts'),
				]),

				// Adding admin plugins
			]),
		]),
	]),

	// SEO
	route('/robots.txt', './routes/_robots.txt.ts'),
	route('/sitemap.xml', './routes/_sitemap.xml.ts'),
] satisfies RouteConfig

export default [...systemRoutes]
// export default [...systemRoutes, ...cv()]
