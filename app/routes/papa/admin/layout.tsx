import { memo, useEffect, useMemo, useState } from 'react'
import {
	Outlet,
	redirect,
	useLoaderData,
	useLocation,
	useOutletContext,
	type LoaderFunctionArgs,
	type MetaFunction,
} from 'react-router'

import { Breadcrumb, BreadcrumbList } from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import {
	SIDEBAR_COOKIE_NAME,
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '~/components/ui/sidebar'
import { FullScreenLoader } from '~/components/loading'
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
		}),
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

	const MemoHeaderWithBreadcrumb = memo(HeaderWithBreadcrumb)
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
				{isMounted && isPending && <FullScreenLoader />}
				<MemoHeaderWithBreadcrumb />

				<Outlet context={adminLoaderData} />
			</SidebarInset>
		</SidebarProvider>
	)
}

const HeaderWithBreadcrumb = () => {
	const location = useLocation()
	const breadcrumbPaths = generateBreadcrumbs(location.pathname)

	return (
		<header className="flex my-3 shrink-0 items-center gap-2">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>{breadcrumbPaths}</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	)
}

export const useAdminContext = () => {
	return useOutletContext<Awaited<ReturnType<typeof loader>>>()
}
