import {
	index,
	layout,
	prefix,
	type RouteConfig,
} from '@react-router/dev/routes'

const systemRoutes = [
	...prefix('/cv', [
		layout('./plugins/cv/layout.tsx', [index('./plugins/cv/index/route.tsx')]),
	]),
] satisfies RouteConfig

export const cv = () => {
	return systemRoutes
}
