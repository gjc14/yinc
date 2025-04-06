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

    // // PAPA layout
    // layout('./routes/layout.tsx', [
    // // Admin layout
    // layout('./routes/admin/layout/route.tsx', [
    //     index('./routes/admin/index/route.tsx'),
    //     route('account', ''),
    //     route('api', ''),
    //     route('assets', ''),
    //     route('blog', ''),
    //     route('company', ''),
    //     route('seo', ''),
    //     route('users', ''),
    //     route('admins', ''),
    //     // Adding admin plugins
    // ]),
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
