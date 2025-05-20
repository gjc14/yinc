import { index, route, type RouteConfig } from '@react-router/dev/routes'

import { blogRoute } from '../../web/papa.routes'

const customizedRoutes = [
	// Add your customized routes here
	blogRoute(),

	route('/', './routes/plugins/yin/layout.tsx', [
		index('./routes/plugins/yin/index/route.tsx'),
	]),

	// The first version of CV
	route('/cv.0', './routes/plugins/cv/index/route.tsx'),
] satisfies RouteConfig

export const yinRoutes = () => {
	return customizedRoutes
}
