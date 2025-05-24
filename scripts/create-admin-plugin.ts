import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const exampleAdminPage = `
// example-plugin/example-admin-page/route.tsx
import { useEffect } from 'react'
import { Outlet, useFetcher } from 'react-router'

import { Button } from '~/components/ui/button'
import type { ConventionalActionResponse } from '~/lib/utils'
import {
	AdminActions,
	AdminContent,
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'

import type { Route } from './+types/route'

// Admin route does not need metadata, which is for seo

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData()
	const client = formData.get('client')

	// Data got from the form is typed \`FormDataEntryValue | null\` so we need to check the type
	if (!client || typeof client !== 'string') {
		throw new Error('Client is not a string')
	}

	if (client === 'failed') {
		return {
			err: 'Hello from the action with conventional error return',
		} satisfies ConventionalActionResponse
	}

	return {
		msg: 'Hello from the action',
	} satisfies ConventionalActionResponse
}

export default function AdminExample() {
	const fetcher = useFetcher<typeof action>()

	const handleClickError = async () => {
		alert('Your going to see an intentional Internal Server Error')
		fetcher.submit({ client: 'failed' }, { method: 'post' })
	}

	const handleClickSuccess = async () => {
		alert('Sending correct data to the server action')
		fetcher.submit({ client: 'success' }, { method: 'post' })
	}

	const handleClickTypeError = async () => {
		alert('Sending type error data to the server action')
		fetcher.submit({}, { method: 'post' })
	}

	useEffect(() => {
		// Effect will run when the fetcher data changes (when the action is called)
		if (fetcher.data) {
			// This data will be typed because we assigned <typeof action> to fetcher
			const data = fetcher.data
			console.log('fetcher.data', data)
		}
	}, [fetcher.data])

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle title="Admin Route Example"></AdminTitle>
				<AdminActions>
					{/* You may put some buttons here */}
					<Button
						onClick={() => {
							// Your function here
							handleClickTypeError()
						}}
					>
						Type Error
					</Button>
					<Button
						onClick={() => {
							// Your function here
							handleClickError()
						}}
					>
						Error
					</Button>
					<Button
						onClick={() => {
							// Your function here
							handleClickSuccess()
						}}
					>
						Success
					</Button>
				</AdminActions>
			</AdminHeader>

			<AdminContent>
				{/* Your main content goes here */}
				Write some content here
				<p className="text-2xl font-bold">Main Content</p>
			</AdminContent>
		</AdminSectionWrapper>
	)
}
`

const exampleAdminSubPage = `
// example-plugin/example-admin-sub-page/route.tsx
import {
	AdminContent,
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'

export default function AdminExample() {
	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle title="Sub Route"></AdminTitle>
			</AdminHeader>

			<AdminContent>
				{/* Your main content goes here */}
				Write some content here in sub route
			</AdminContent>
		</AdminSectionWrapper>
	)
}
`

const exampleAdminPapaConfig = `
import type { PapaConfig } from '../utils/get-plugin-configs.server'

const config = (): PapaConfig => {
    return {
        pluginName: 'Example Plugin',
        adminRoutes: [
            {
                title: 'Example Plugin',
                url: 'example-admin-page',
                iconName: 'rocket',
                sub: [
                    {
                        title: 'Sub Page',
                        url: 'example-admin-sub-page',
                    },
                ],
            },
        ],
    }
}

export default config
`

const exampleAdminPageRoute = `
// example-plugin/routes.ts
import {
	index,
	layout,
	prefix,
	route,
	type RouteConfig,
} from '@react-router/dev/routes'

// This should be imported and used as \`...customizedAdminRoutes\` in \`customizedRoutes\` of \`/app/routes/papa/admin/routes.ts\`
export const customizedAdminRoutes = [
	// write your admin routes here, route should either:
	// 1. relative path: \`route('custom-route', './where/your/file.tsx')\` , which will automatically render under \`/admin/custom-route\`.
	// 2. direct path start with \`/admin\`: \`route('/admin/custom-route', './where/your/file.tsx')\`

	route(
		'example-admin-page',
		'./routes/plugins/example-plugin/example-admin-page/route.tsx',
	),
	route(
		'example-admin-page/example-admin-sub-page',
		'./routes/plugins/example-plugin/example-admin-sub-page/route.tsx',
	),
] satisfies RouteConfig
`

const filePathExampleAdmin = join(
	process.cwd(),
	'app/routes/plugins/example-plugin/example-admin-page/route.tsx',
)

const filePathExampleAdminSub = join(
	process.cwd(),
	'app/routes/plugins/example-plugin/example-admin-sub-page/route.tsx',
)

const filePathExampleAdminConfig = join(
	process.cwd(),
	'app/routes/plugins/example-plugin/papa.config.ts',
)

const filePathExamplePluginRoutes = join(
	process.cwd(),
	'app/routes/plugins/example-plugin/routes.ts',
)

const adminRoutesPath = join(process.cwd(), 'app/routes/papa/admin/routes.ts')

try {
	await mkdir(join(process.cwd(), 'app/routes/plugins/example-plugin'), {
		recursive: true,
	})
	await mkdir(
		join(process.cwd(), 'app/routes/plugins/example-plugin/example-admin-page'),
		{
			recursive: true,
		},
	)
	await mkdir(
		join(
			process.cwd(),
			'app/routes/plugins/example-plugin/example-admin-sub-page',
		),
		{
			recursive: true,
		},
	)

	await writeFile(filePathExampleAdmin, exampleAdminPage.trim())
	await writeFile(filePathExampleAdminSub, exampleAdminSubPage.trim())
	await writeFile(filePathExampleAdminConfig, exampleAdminPapaConfig.trim())
	await writeFile(filePathExamplePluginRoutes, exampleAdminPageRoute.trim())

	// Modify adminRoutesPath
	try {
		let adminRoutesContent = await readFile(adminRoutesPath, 'utf-8')
		const importStatement =
			"import { customizedAdminRoutes } from '../../plugins/example-plugin/routes';"
		const importAnchor = "from '@react-router/dev/routes'" // Anchor to insert the import after
		const customizedRoutesAnchor = '// Add your customized routes here' // Anchor to insert the spread operator after

		// Add import statement if not already present
		if (!adminRoutesContent.includes(importStatement)) {
			const importIndex =
				adminRoutesContent.indexOf(importAnchor) + importAnchor.length
			adminRoutesContent =
				adminRoutesContent.slice(0, importIndex) +
				'\n' +
				importStatement +
				adminRoutesContent.slice(importIndex)
		}

		// Add ...customizedAdminRoutes to the array
		const spreadRoutes = '...customizedAdminRoutes,'
		if (!adminRoutesContent.includes(spreadRoutes)) {
			const customizedRoutesIndex =
				adminRoutesContent.indexOf(customizedRoutesAnchor) +
				customizedRoutesAnchor.length
			adminRoutesContent =
				adminRoutesContent.slice(0, customizedRoutesIndex) +
				'\n\t' +
				spreadRoutes +
				adminRoutesContent.slice(customizedRoutesIndex)
		}

		await writeFile(adminRoutesPath, adminRoutesContent.trim())
		console.log(`✅ Successfully updated ${adminRoutesPath}`)
	} catch (err) {
		console.error(`Error updating ${adminRoutesPath}:`, err)
	}

	console.log(
		`🎉 Example admin pages and config created successfully in routes folder

		1️⃣ ${filePathExampleAdmin.split('app/routes')[1]}
		2️⃣ ${filePathExampleAdminSub.split('app/routes')[1]}
		3️⃣ ${filePathExampleAdminConfig.split('app/routes')[1]}
		4️⃣ ${filePathExamplePluginRoutes.split('app/routes')[1]}
        
        🏄 Navigate to 'admin/example-admin-page' to see in action
        `.replace(/^[ \t]+/gm, ''),
	)
} catch (err) {
	console.error('Error creating example admin files:', err)
}
