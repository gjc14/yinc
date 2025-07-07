import type { Route } from './+types/route'
import { memo, useMemo, useState } from 'react'
import {
	isRouteErrorResponse,
	Link,
	Outlet,
	redirect,
	useLocation,
	useRouteError,
} from 'react-router'

import { Undo2 } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { statusCodeMap } from '~/lib/utils/status-code'

import { validateAdminSession } from '../../auth/utils'
import { getServiceDashboardConfigs } from '../../utils/get-service-configs'
import type { ServiceDashboardConfig } from '../components/service-swicher'
import { DashboardSidebar } from './components/dashboard-sidebar'
import {
	DEFAULT_MAIN_NAV_ITEMS,
	DEFAULT_SECONDARY_NAV_ITEMS,
	DEFAULT_SERVICE,
} from './components/data'
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

const MemoDashboardSidebar = memo(DashboardSidebar)
const MemoHeaderWithBreadcrumb = memo(HeaderWithBreadcrumbs)

export const loader = async ({ request }: Route.LoaderArgs) => {
	const usesrSession = await validateAdminSession(request)

	if (!usesrSession) {
		throw redirect('/dashboard/portal')
	}

	return {
		admin: usesrSession.user,
	}
}

export default function Admin({ loaderData }: Route.ComponentProps) {
	const { admin } = loaderData
	const location = useLocation()
	const [isDashboard, setIsDashboard] = useState(true)
	const [currentService, setCurrentService] =
		useState<ServiceDashboardConfig>(DEFAULT_SERVICE)

	const memoizedUser = useMemo(
		() => ({
			...admin,
			name: admin.name ?? 'Papa Fritas',
			image: admin.image ?? '/placeholders/avatar.png',
			role: admin.role ?? 'admin',
		}),
		[admin],
	)

	const serviceDashboardConfigs = useMemo(
		() => getServiceDashboardConfigs(),
		[],
	)

	const availableServices = useMemo(() => {
		const services: ServiceDashboardConfig[] = [
			DEFAULT_SERVICE,
			...serviceDashboardConfigs,
		]
		return services
	}, [serviceDashboardConfigs])

	const currentSidebarItems = useMemo(() => {
		const currentService = serviceDashboardConfigs.find(service =>
			location.pathname.startsWith(service.pathname),
		)

		if (currentService?.sidebar) {
			setIsDashboard(false)
			setCurrentService(currentService)
			return currentService.sidebar
		}

		setIsDashboard(true)
		setCurrentService(DEFAULT_SERVICE)
		return DEFAULT_MAIN_NAV_ITEMS
	}, [location.pathname, serviceDashboardConfigs])

	return (
		<SidebarProvider>
			<MemoDashboardSidebar
				user={memoizedUser}
				services={availableServices}
				currentService={currentService}
				mainNavItems={currentSidebarItems}
				secondaryNavItems={
					isDashboard ? DEFAULT_SECONDARY_NAV_ITEMS : undefined
				}
			/>

			<SidebarInset className="h-[calc(100svh-(--spacing(4)))] overflow-x-hidden">
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
				returnTo={'/dashboard'}
			/>
		)
	} else if (error instanceof Error) {
		// throw new Error('message')
		console.error('Error:', error)

		return (
			<ErrorTemplate
				status={500}
				statusText={'Internal Error'}
				returnTo={'/dashboard'}
			/>
		)
	}

	console.error('Unknown Error:', error)

	return (
		// Unknown error
		<ErrorTemplate
			status={'XXX'}
			statusText={'Unknown Error'}
			returnTo={'/dashboard'}
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
