import { memo, useEffect, useMemo, useState } from 'react'
import {
	type LoaderFunctionArgs,
	type MetaFunction,
	Outlet,
	redirect,
	useLoaderData,
	useLocation,
	useOutletContext,
} from 'react-router'

import { FullScreenLoading } from '~/components/loading'
import { Breadcrumb, BreadcrumbList } from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import {
	SIDEBAR_COOKIE_NAME,
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '~/components/ui/sidebar'
import { authClient } from '~/lib/auth/auth-client'
import { generateBreadcrumbs } from '~/lib/utils'
import { AdminSidebar } from '~/routes/papa/admin/components/admin-sidebar'
import { getPluginConfigs } from '~/routes/plugins/utils/get-plugin-configs.server'
import { validateAdminSession } from '../auth/utils'

export const meta: MetaFunction = () => {
	return [{ title: 'Admin' }, { name: 'description', content: 'Admin page' }]
}

const parseSidebarStatus = (cookieHeader: string) => {
	const cookies = Object.fromEntries(
		cookieHeader.split(';').map(cookie => {
			const [name, value] = cookie.trim().split('=')
			return [name, decodeURIComponent(value)]
		})
	)

	return cookies[SIDEBAR_COOKIE_NAME]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const usesrSession = await validateAdminSession(request)

	if (!usesrSession) {
		throw redirect('/admin/signin')
	}

	const cookieHeader = request.headers.get('Cookie')

	const parsedSidebarStatus = cookieHeader
		? parseSidebarStatus(cookieHeader)
		: null

	const pluginConfigs = await getPluginConfigs()
	const pluginRoutes = pluginConfigs
		.flatMap(config => config.adminRoutes)
		.filter(routeItem => !!routeItem)

	return {
		admin: usesrSession.user,
		pluginRoutes: pluginRoutes,
		sidebarStatus: parsedSidebarStatus === 'true',
	}
}

const MemoAdminSidebar = memo(AdminSidebar)

export default function Admin() {
	const adminLoaderData = useLoaderData<typeof loader>()
	const { admin, pluginRoutes, sidebarStatus } = adminLoaderData
	const location = useLocation()
	const { isPending } = authClient.useSession()
	const [isMounted, setIsMounted] = useState(false)
	const breadcrumbPaths = generateBreadcrumbs(location.pathname)

	const memoizedUser = useMemo(
		() => ({
			...admin,
			name: admin.name ?? 'Papa Fritas',
			image: admin.image ?? '/placeholders/avatar.png',
			role: admin.role ?? 'admin',
		}),
		[admin]
	)

	const memoizedPluginRoutes = useMemo(() => pluginRoutes, [pluginRoutes])

	useEffect(() => {
		setIsMounted(true)
	}, [])

	return (
		<SidebarProvider defaultOpen={sidebarStatus}>
			<MemoAdminSidebar
				user={memoizedUser}
				pluginRoutes={memoizedPluginRoutes}
			/>
			<SidebarInset className="h-[calc(100svh-(--spacing(4)))] overflow-x-hidden">
				{isMounted && isPending && <FullScreenLoading />}
				<header className="flex my-3 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>{breadcrumbPaths}</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>

				<Outlet context={adminLoaderData} />
			</SidebarInset>
		</SidebarProvider>
	)
}

export const useAdminContext = () => {
	return useOutletContext<Awaited<ReturnType<typeof loader>>>()
}
