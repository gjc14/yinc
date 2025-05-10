import {
	index,
	layout,
	prefix,
	route,
	type RouteConfig,
} from '@react-router/dev/routes'

import { blogRoute, indexRoute, splatRoute } from './papa.routes'

// Configure your customized routes here
const customizedRoutes = [
	// Add your customized routes here
] satisfies RouteConfig

const systemRoutes = [
	layout('./routes/web/layout.tsx', [
		...(customizedRoutes.length === 0
			? [
					indexRoute(),
					blogRoute(),
					splatRoute(),
					...prefix('/hello-world', [
						layout('./routes/web/hello-world/layout.tsx', [
							index('./routes/web/hello-world/index/route.tsx'),
							route(
								':whateverParam',
								'./routes/web/hello-world/param/route.tsx',
							),
						]),
						// This is the same as the above, but using the `route` function
						// route('/hello-world/hello', './routes/web/hello-world/layout.tsx', [
						// 	index('./routes/web/hello-world/index/route.tsx'),
						// 	route(':whateverParam', './routes/web/hello-world/param/route.tsx'),
						// ])
					]),
				]
			: // Adding customized web routes
				customizedRoutes),
	]),
] satisfies RouteConfig

export const webPage = () => {
	return [...systemRoutes]
}
