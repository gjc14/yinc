import {
	index,
	layout,
	prefix,
	route,
	type RouteConfig,
} from '@react-router/dev/routes'

const customizedRoutes = [
	// Add your customized routes here
] satisfies RouteConfig

const systemRoutes = [
	layout('./routes/web/layout.tsx', [
		index('./routes/web/index/route.tsx'),
		route('/blog', './routes/web/blog/layout.tsx', [
			index('./routes/web/blog/index/route.tsx'),
			route(':postSlug', './routes/web/blog/post-slug/route.tsx'),
			route(':postSlug/edit', './routes/web/blog/post-slug-edit/route.tsx'),
			route('category', './routes/web/blog/category/route.tsx'),
			route('tag', './routes/web/blog/tag/route.tsx'),
			route('subscribe', './routes/web/blog/subscribe/route.tsx'),
		]),
		route('/*', './routes/web/$/route.tsx'),

		...prefix('/hello-world', [
			layout('./routes/web/hello-world/layout.tsx', [
				index('./routes/web/hello-world/index/route.tsx'),
				route(':whateverParam', './routes/web/hello-world/param/route.tsx'),
			]),
		]),
		// This is the same as the above, but using the `route` function
		// route('/hello-world/hello', './routes/web/hello-world/layout.tsx', [
		// 	index('./routes/web/hello-world/index/route.tsx'),
		// 	route(':whateverParam', './routes/web/hello-world/param/route.tsx'),
		// ])

		// Adding customized web routes
		...customizedRoutes,
	]),
] satisfies RouteConfig

export const webPage = () => {
	return [...systemRoutes]
}
