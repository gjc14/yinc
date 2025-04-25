import {
	index,
	layout,
	prefix,
	route,
	type RouteConfig,
} from '@react-router/dev/routes'

const customizedRoutes = [
	...prefix('/hello-world', [
		layout('./routes/web/hello-world/layout.tsx', [
			index('./routes/web/hello-world/index/route.tsx'),
			route(':whateverParam', './routes/web/hello-world/param/route.tsx'),
		]),
	]),
] satisfies RouteConfig

export const webPage = () => {
	return [...customizedRoutes]
}
