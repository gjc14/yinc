import type { Route } from './+types/route'
import { memo, useEffect, useMemo, useState } from 'react'
import {
	isRouteErrorResponse,
	Link,
	Outlet,
	redirect,
	useRouteError,
} from 'react-router'

import { Undo2 } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { FullScreenLoader } from '~/components/loading'
import { authClient } from '~/lib/auth/auth-client'
import { statusCodeMap } from '~/lib/utils/status-code'
import { getPluginConfigs } from '~/routes/plugins/utils/get-plugin-configs.server'

import { validateAdminSession } from '../../auth/utils'
import { AdminSidebar } from './components/admin-sidebar'
import { HeaderWithBreadcrumbs } from './components/header-breadcrumbs'

export const meta = ({ error }: Route.MetaArgs) => {
	if (!error) {
		return [
			{ title: 'Papa Open Source CMS' },
			{
				name: 'description',
				content: 'This is the admin page of Papa Open Source CMS',
			},
		]
	}
}

const MemoAdminSidebar = memo(AdminSidebar)
const MemoHeaderWithBreadcrumb = memo(HeaderWithBreadcrumbs)

export const loader = async ({ request }: Route.LoaderArgs) => {
	const usesrSession = await validateAdminSession(request)

	if (!usesrSession) {
		throw redirect('/admin/portal')
	}

	const pluginConfigs = await getPluginConfigs()
	const pluginRoutes = pluginConfigs
		.flatMap(config => config.adminRoutes)
		.filter(routeItem => !!routeItem)

	return {
		admin: usesrSession.user,
		pluginRoutes: pluginRoutes,
	}
}

export default function Admin({ loaderData }: Route.ComponentProps) {
	const { admin, pluginRoutes } = loaderData
	const { isPending } = authClient.useSession()
	const [isMounted, setIsMounted] = useState(false)

	const memoizedUser = useMemo(
		() => ({
			...admin,
			name: admin.name ?? 'Papa Fritas',
			image: admin.image ?? '/placeholders/avatar.png',
			role: admin.role ?? 'admin',
		}),
		[admin],
	)

	const memoizedPluginRoutes = useMemo(() => pluginRoutes, [pluginRoutes])

	useEffect(() => {
		setIsMounted(true)
	}, [])

	return (
		<SidebarProvider className="">
			<MemoAdminSidebar
				user={memoizedUser}
				pluginRoutes={memoizedPluginRoutes}
			/>
			<SidebarInset className="h-[calc(100svh-(--spacing(4)))] overflow-x-hidden">
				{isMounted && isPending && <FullScreenLoader />}
				<MemoHeaderWithBreadcrumb />

				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()

	// Route throw new Response (404, etc.)
	if (isRouteErrorResponse(error)) {
		console.error('Admin Route Error Response:', error)

		const statusMessage = statusCodeMap[error.status]
		const errorMessage = error.data || statusMessage.text || 'Error Response'

		return (
			<ErrorTemplate
				status={error.status}
				statusText={errorMessage}
				returnTo={'/admin'}
			/>
		)
	} else if (error instanceof Error) {
		// throw new Error('message')
		console.error('Error:', error)

		return (
			<ErrorTemplate
				status={500}
				statusText={'Internal Error'}
				returnTo={'/admin'}
			/>
		)
	}

	console.error('Unknown Error:', error)

	return (
		// Unknown error
		<ErrorTemplate
			status={'XXX'}
			statusText={'Unknown Error'}
			returnTo={'/admin'}
		/>
	)
}

const ErrorTemplate = ({
	status,
	statusText,
	returnTo,
}: {
	status: string | number
	statusText: string
	returnTo: string
}) => {
	return (
		<main className="w-screen h-svh flex flex-col items-center justify-center">
			<div className="fixed text-center">
				<div className="flex items-center justify-center mb-3">
					<h1 className="inline-block mr-5 pr-5 text-3xl font-normal border-r">
						{status}
					</h1>
					<h2 className="text-base font-light">{statusText || 'Error Page'}</h2>
				</div>

				<Link to={returnTo}>
					<Button variant={'link'}>
						<span>
							Return to <code>{returnTo}</code>
						</span>
						<Undo2 size={12} />
					</Button>
				</Link>
			</div>

			<div className="fixed bottom-8 flex items-center font-open-sans">
				<p className="inline-block mr-3 pr-5 text-lg font-normal border-r">
					Papa
				</p>
				<div className="inline-block">
					<p className="text-xs font-light text-left">
						© {new Date().getFullYear()} CHIU YIN CHEN @Taipei
					</p>
				</div>
			</div>
		</main>
	)
}
