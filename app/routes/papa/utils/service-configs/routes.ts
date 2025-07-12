import type { RouteConfig } from '@react-router/dev/routes'

import { getServiceRoutesModules } from './helpers'

export const servicesRoutes = () => {
	const modules = getServiceRoutesModules()
	const servicesRoutes: RouteConfig = []

	/**
	 * Automatically includes all service routes without manual imports
	 */
	for (const [path, service] of Object.entries(modules)) {
		try {
			if (!service.routes) continue

			if (Array.isArray(service.routes)) {
				servicesRoutes.push(...service.routes)
			}
		} catch (error) {
			console.error(`Failed to load routes from ${path}:`, error)
		}
	}

	return servicesRoutes
}
