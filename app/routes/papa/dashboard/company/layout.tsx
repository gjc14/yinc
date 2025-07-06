import type { Route } from './+types/layout'
import { Outlet } from 'react-router'

import {
	AnimatedNav,
	type RouteButton,
} from '~/components/animated-horizontal-nav'
import {
	DashboardHeader,
	DashboardSectionWrapper,
	DashboardTitle,
} from '~/routes/papa/dashboard/components/dashboard-wrapper'

const DashboardCompanyRoutes: RouteButton[] = [
	{ to: '/dashboard/company', title: 'Profile' },
	{ to: '/dashboard/company/billing', title: 'Billing' },
	{ to: '/dashboard/company/notification', title: 'Notification' },
	{ to: '/dashboard/company/security', title: 'Security' },
]

export default function DashboardCompany({}: Route.ComponentProps) {
	return (
		<DashboardSectionWrapper>
			<DashboardHeader>
				<DashboardTitle className="w-full">
					<AnimatedNav routes={DashboardCompanyRoutes} />
				</DashboardTitle>
			</DashboardHeader>
			<Outlet />
		</DashboardSectionWrapper>
	)
}
