import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const examplePage = `
/**
 * Navigate to '/plugin-example' to see this route in action
 */
import { data, type LoaderFunctionArgs, type MetaFunction } from 'react-router'
import { useLoaderData } from 'react-router'

import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
    if (!data || !data.meta) {
        return []
    }

    return data.meta.metaTags
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { seo } = await getSEO(new URL(request.url).pathname)
    const meta = seo ? createMeta(seo, new URL(request.url)) : null

    try {
        // You could directly return object
        return { meta }
    } catch (error) {
        console.error(error)
        // Only when you want to return response will you need to use \`data\` function
        // Read more: https://reactrouter.com/how-to/headers#1-wrap-your-return-value-in-data
        return data(
            { meta },
            {
                headers: {
                    'Cache-Control': 'no-store',
                },
            }
        )
    }
}

export default function ExamplePluginWebPage() {
    const { meta } = useLoaderData<typeof loader>()

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center space-y-2">
            <h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>
            <h2>Example plugin web page</h2>
            <p className="text-3xl">🔨🔨🔨</p>
        </div>
    )
}
`

const examplePapaConfig = `
/**
 * This file is optional for a web only plugin.
 */
import type { PapaConfig } from '../utils/get-plugin-configs.server'

const config = (): PapaConfig => {
    return {
        pluginName: 'Example Web Plugin',
    }
}

export default config
`

const filePathExample = join(
	process.cwd(),
	'app/routes/plugins/example-web.plugin/_web.plugin-example/route.tsx',
)

const filePathExampleWebConfig = join(
	process.cwd(),
	'app/routes/plugins/example-web.plugin/papa.config.ts',
)

try {
	console.log('Not Implemented')
	process.exit(1)

	await mkdir(
		join(
			process.cwd(),
			'app/routes/plugins/example-web.plugin/_web.plugin-example',
		),
		{ recursive: true },
	)

	await writeFile(filePathExample, examplePage.trim())
	await writeFile(filePathExampleWebConfig, examplePapaConfig.trim())
	console.log(
		`Example web page and config created successfully in routes folder ${
			filePathExample.split('app/routes')[1]
		} and ${filePathExampleWebConfig.split('app/routes')[1]}
        
        Navigate to '/plugin-example' to see this route in action
        `.replace(/^ {8}/gm, ''),
	)
} catch (err) {
	console.error('Error creating example web files:', err)
}
