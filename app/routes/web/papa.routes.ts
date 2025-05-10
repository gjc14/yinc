import { index, route } from '@react-router/dev/routes'

export const indexRoute = () => {
	return index('./routes/web/index/route.tsx')
}

export const blogRoute = () => {
	return route('/blog', './routes/web/blog/layout.tsx', [
		index('./routes/web/blog/index/route.tsx'),
		route(':postSlug', './routes/web/blog/post-slug/route.tsx'),
		route(':postSlug/edit', './routes/web/blog/post-slug-edit/route.tsx'),
		route('category', './routes/web/blog/category/route.tsx'),
		route('tag', './routes/web/blog/tag/route.tsx'),
		route('subscribe', './routes/web/blog/subscribe/route.tsx'),
	])
}

export const splatRoute = () => {
	return route('/*', './routes/web/$/route.tsx')
}
