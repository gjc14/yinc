import {
    type RouteConfig,
    index,
    route,
    layout,
    prefix,
} from '@remix-run/route-config'

export default [
    layout('./routes/web/layout.tsx', [
        index('./routes/web/index/route.tsx'),
        ...prefix('/blog', [
            layout('./routes/web/blog/layout.tsx', [
                index('./routes/web/blog/index/route.tsx'),
                route(':postSlug', './routes/web/blog/post-slug/route.tsx'),
                route(
                    '/category/:query',
                    './routes/web/blog/category/route.tsx'
                ),
                route('/tag/:query', './routes/web/blog/tag/route.tsx'),
                route('/subscribe', './routes/web/blog/subscribe/route.tsx'),
            ]),
        ]),
        route('/*', './routes/web/$/route.tsx'),

        // Adding web plugins
    ]),

    // PAPA layout
    layout('./routes/papa/layout.tsx', [
        // PAPA assets resource route
        route('assets/:visibility', './routes/papa/assets/route.tsx'),
        route('assets/error', './routes/papa/assets/error.tsx'),

        // Admin layout
        ...prefix('/admin', [
            layout('./routes/papa/admin/layout.tsx', [
                index('./routes/papa/admin/index/route.tsx'),

                // Admin API
                ...prefix('/api', [
                    route(
                        '/ai/chat',
                        './routes/papa/admin/api/ai-chat/route.tsx'
                    ),
                    route(
                        '/object-storage',
                        './routes/papa/admin/api/object-storage/route.tsx'
                    ),
                ]),
                // Assets
                ...prefix('/assets', [
                    index('./routes/papa/admin/assets/index.tsx'),
                    route(
                        '/resource',
                        './routes/papa/admin/assets/resource.ts'
                    ),
                ]),
                // Account
                ...prefix('/account', [
                    layout('./routes/papa/admin/account/layout.tsx', [
                        index('./routes/papa/admin/account/index/route.tsx'),
                        route(
                            '/billing',
                            './routes/papa/admin/account/billing/route.tsx'
                        ),
                        route(
                            '/notification',
                            './routes/papa/admin/account/notification/route.tsx'
                        ),
                        route(
                            '/security',
                            './routes/papa/admin/account/security/route.tsx'
                        ),
                    ]),
                ]),
                // Blog
                ...prefix('/blog', [
                    layout('./routes/papa/admin/blog/layout.tsx', [
                        index('./routes/papa/admin/blog/index/route.tsx'),
                        route(
                            '/generative',
                            './routes/papa/admin/blog/generative/route.tsx'
                        ),
                        route('/new', './routes/papa/admin/blog/new/route.tsx'),
                        route(
                            '/:postSlug',
                            './routes/papa/admin/blog/post-slug/route.tsx'
                        ),
                        route(
                            '/resource',
                            './routes/papa/admin/blog/resource.ts'
                        ),
                        ...prefix('/taxonomy', [
                            index(
                                './routes/papa/admin/blog/taxonomy/index.tsx'
                            ),
                            route(
                                '/resource',
                                './routes/papa/admin/blog/taxonomy/resource.ts'
                            ),
                        ]),
                    ]),
                ]),
                //     route('api', ''),
                //     route('assets', ''),
                //     route('blog', ''),
                //     route('company', ''),
                //     route('seo', ''),
                //     route('users', ''),
                //     route('admins', ''),
                // Adding admin plugins
            ]),
        ]),
    ]),
] satisfies RouteConfig

/**
 * Get all plugin folder which match *.plugin in directory /app/routes/plugins as flat route.
 */
import * as fs from 'fs'
import * as path from 'path'

const pluginsDir = path.join(__dirname, 'routes', 'plugins')

function getPluginRoutes(): string[] {
    try {
        const files = fs.readdirSync(pluginsDir)
        return files
            .filter(file => file.endsWith('.plugin'))
            .map(file => path.join('routes', 'plugins', file))
    } catch (error) {
        console.error('Error reading plugins directory:', error)
        return []
    }
}
console.log(getPluginRoutes())
