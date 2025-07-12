import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const websiteServiceConfig = `
import { index, route } from '@react-router/dev/routes'

import type { Service } from '../../papa/utils/service-configs'

export const config = {
	routes: [
		route(
			'/',
			'./routes/services/website/layout.tsx',
			[
				index('./routes/services/website/index.tsx'),
				route('about', './routes/services/website/about.tsx'),
			],
		),
	],
} satisfies Service
`

const websiteLayout = `
import { Link, Outlet } from 'react-router'

export default function WebsiteLayout() {
	return (
		<div className="min-h-svh flex flex-col">
			{/* Header */}
			<header className="border-b sticky top-0 z-50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-2">
							<span className="text-2xl">🍟</span>
						</div>
						
						<nav className="flex items-center space-x-8">
							<Link 
								to="/" 
								className="hover:underline"
							>
								Home
							</Link>
							<Link 
								to="/about" 
								className="hover:underline"
							>
								About
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="flex-1">
				<Outlet />
			</main>

			{/* Footer */}
			<footer className="border-t">
				<div className="container mx-auto  px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center text-muted-foreground">
						<p>Footer</p>
					</div>
				</div>
			</footer>
		</div>
	)
}
`

const websiteIndex = `
export default function Website() {
	return (
		<div className="flex-1 flex items-center justify-center py-16">
			<div className="mx-auto text-center px-4">
				<h1 className="text-4xl font-bold mb-6">Main page</h1>
				<p className="text-lg text-muted-foreground">
					Any content goes here!
				</p>
			</div>
		</div>
	)
}
`

const websiteAbout = `
export default function About() {
	return (
		<div className="py-16">
			<div className="mx-auto px-4 text-center">
				<h1 className="text-4xl font-bold mb-6">About Page</h1>
				<p className="text-lg text-muted-foreground">
					Any content goes here!
				</p>
			</div>
		</div>
	)
}
`

// File paths for website service
const filePathServiceConfig = join(
	process.cwd(),
	'app/routes/services/website/config.tsx',
)

const filePathIndex = join(
	process.cwd(),
	'app/routes/services/website/index.tsx',
)

const filePathLayout = join(
	process.cwd(),
	'app/routes/services/website/layout.tsx',
)

const filePathAbout = join(
	process.cwd(),
	'app/routes/services/website/about.tsx',
)

try {
	// Create directories
	await mkdir(join(process.cwd(), 'app/routes/services/website'), {
		recursive: true,
	})

	// Write all service files
	await writeFile(filePathServiceConfig, websiteServiceConfig.trim())
	await writeFile(filePathIndex, websiteIndex.trim())
	await writeFile(filePathLayout, websiteLayout.trim())
	await writeFile(filePathAbout, websiteAbout.trim())

	console.log(
		`🎉 Website service files created successfully!

		📁 Created 4 files:
		1️⃣ ${filePathServiceConfig.split('app/routes')[1]}
		2️⃣ ${filePathIndex.split('app/routes')[1]}
		3️⃣ ${filePathLayout.split('app/routes')[1]}
		4️⃣ ${filePathAbout.split('app/routes')[1]}
        
        🌐 Navigate to '/' to see the website service in action
        📖 Navigate to '/about' to see the about page
        `.replace(/^[ \t]+/gm, ''),
	)
} catch (err) {
	console.error('Error creating website service files:', err)
}
