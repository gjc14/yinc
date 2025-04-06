import { type RouteConfig } from '@remix-run/route-config'

export default [] satisfies RouteConfig

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
