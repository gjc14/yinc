import {
	index,
	layout,
	prefix,
	type RouteConfig,
} from '@react-router/dev/routes'

const systemRoutes = [
	...prefix('/cv', [
		layout('./routes/cv/layout.tsx', [index('./routes/cv/index/route.tsx')]),
	]),
] satisfies RouteConfig

export const cv = () => {
	return systemRoutes
}
