/**
 * Where will match all routes that are not matched by other routes.
 * This is a catch-all route, not a resource route nor a redirect route.
 */

export function loader() {
	throw new Response('', { status: 404, statusText: 'Not Found' })
}

export default function NotFoundRoute() {
	return null
}
