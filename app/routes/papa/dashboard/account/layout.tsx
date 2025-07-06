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

const DashboardAccountRoutes: RouteButton[] = [
	{ to: '/dashboard/account', title: 'Profile' },
	{ to: '/dashboard/account/billing', title: 'Billing' },
	{ to: '/dashboard/account/notification', title: 'Notification' },
	{ to: '/dashboard/account/security', title: 'Security' },
]

export default function DashboardAccount() {
	return (
		<DashboardSectionWrapper>
			<DashboardHeader>
				<DashboardTitle>
					<AnimatedNav routes={DashboardAccountRoutes} />
				</DashboardTitle>
			</DashboardHeader>
			<Outlet />
		</DashboardSectionWrapper>
	)
}
