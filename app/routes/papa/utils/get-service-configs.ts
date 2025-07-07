/**
 * Utility functions for dynamically loading service routes
 * This file automatically discovers and imports all service routes
 */

import type { RouteConfig } from '@react-router/dev/routes'

import type { ServiceDashboardConfig } from '~/routes/papa/dashboard/components/service-swicher'

import type { DashboardMenuItem } from '../dashboard/layout/components/dashboard-sidebar/nav-menu'

export interface Service {
	dashboard?: ServiceDashboardConfig & {
		/**
		 * Routes specific to the service dashboard
		 * @example
		 * ```
		 * routes: [
		 *   // Absolute path but under /dashboard
		 *   route('/dashboard/your-service-dashboard', './routes/services/example/dashboard/route.tsx'),
		 *
		 *   // Relative path will automatically render and goes under /dashboard
		 *   route('your-service-dashboard', './routes/services/example/dashboard/route.tsx'),
		 * ]
		 * ```
		 */
		routes: RouteConfig
		/**
		 * @example
		 * ```ts
		 * const MainNavItems: DashboardMenuItem[] = [
		 * 	{ icon: Cloud, title: 'Assets', pathname: 'assets' },
		 * 	{ icon: TextSearch, title: 'SEO', pathname: 'seo' },
		 * ]
		 * ```
		 */
		sidebar?: DashboardMenuItem[]
	}
	/**
	 * Routes specific to the service
	 * @example
	 * ```
	 * routes: [
	 * 		route('/new-shop', './routes/services/new-service/shop/layout.tsx', [
	 * 		index('./routes/services/new-service/shop/index.tsx'),
	 * 		route(
	 * 			':productId',
	 * 			'./routes/services/new-service/shop/product/route.tsx',
	 * 		),
	 * 	]),
	 * ]
	 * ```
	 */
	routes?: RouteConfig
}

/**
 * Type guard to check if an item is a valid DashboardMenuItem
 */
const isDashboardMenuItem = (item: unknown): item is DashboardMenuItem => {
	const hasTitlePathname = (
		item: any,
	): item is { title: string; pathname: string } & {
		[key: string]: unknown
	} => {
		return (
			typeof item === 'object' &&
			item !== null &&
			typeof item.title === 'string' &&
			typeof item.pathname === 'string'
		)
	}

	if (!hasTitlePathname(item) || !item.icon) {
		// Parent sidebar item must have icon
		return false
	}

	// Check sub sidebar if it exists
	if (item.sub !== undefined) {
		if (!Array.isArray(item.sub)) {
			return false
		}

		for (const subItem of item.sub) {
			if (!hasTitlePathname(subItem)) {
				return false
			}
		}
	}

	return true
}

/**
 * Dynamically import all service routes
 * This uses Vite's import.meta.glob to automatically discover all routes.ts files
 * in service directories and import them at build time
 */
const getServiceRoutesModules = () => {
	// This will be resolved at build time by Vite
	const modules = import.meta.glob('../../services/*/config.tsx', {
		eager: true, // Ensure we load the modules at build time
		import: 'config', // Import the named export 'config'
	}) as Record<string, Service>

	return modules
}

/**
 * Helper function to parse the dashboard configuration
 */
const parseDashboardConfigs = (
	config: any,
): ServiceDashboardConfig & {
	sidebar?: DashboardMenuItem[]
} => {
	if (typeof config !== 'object' || config === null) {
		throw new Error('Invalid config type, expected an object')
	}

	if (typeof config.name !== 'string') {
		throw new Error('Invalid config name, expected a string')
	}

	if (typeof config.logo !== 'string' && !config.logo) {
		throw new Error(
			'Invalid config logo, expected a string or a React ElementType',
		)
	}

	if (typeof config.pathname !== 'string') {
		throw new Error('Invalid config pathname, expected a string')
	}

	if (config.sidebar !== undefined) {
		if (
			!Array.isArray(config.sidebar) ||
			!config.sidebar.every(isDashboardMenuItem)
		) {
			throw new Error(
				'Invalid config sidebar, expected an array of DashboardMenuItem',
			)
		}
	}

	return {
		name: config.name,
		logo: config.logo,
		pathname: config.pathname,
		sidebar: config.sidebar,
	}
}

/**
 * Get all available service dashboard configurations including sidebar
 */
export const getServiceDashboardConfigs = () => {
	const modules = getServiceRoutesModules()
	const dashboardConfigs: (ServiceDashboardConfig & {
		sidebar?: DashboardMenuItem[]
	})[] = []

	/**
	 * Automatically includes all service routes without manual imports
	 */
	for (const [path, service] of Object.entries(modules)) {
		try {
			if (!service.dashboard) continue

			const config = parseDashboardConfigs(service.dashboard)
			dashboardConfigs.push(config)
		} catch (error) {
			console.error(`Failed to load dashboard config from ${path}:`, error)
		}
	}

	return dashboardConfigs
}

export const servicesDashboardRoutes = () => {
	const modules = getServiceRoutesModules()
	const servicesRoutes: RouteConfig = []

	/**
	 * Automatically includes all service routes without manual imports
	 */
	for (const [path, service] of Object.entries(modules)) {
		try {
			if (!service.dashboard) continue

			if (Array.isArray(service.dashboard.routes)) {
				servicesRoutes.push(...service.dashboard.routes)
			}
		} catch (error) {
			console.error(`Failed to load routes from ${path}:`, error)
		}
	}

	return servicesRoutes
}

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
