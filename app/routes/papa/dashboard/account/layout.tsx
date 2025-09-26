import { Outlet } from 'react-router'

import {
	AnimatedNav,
	type RouteButton,
} from '~/components/animated-horizontal-nav'
import { Loading } from '~/components/loading'
import {
	DashboardContent,
	DashboardHeader,
	DashboardSectionWrapper,
	DashboardTitle,
} from '~/routes/papa/dashboard/components/dashboard-wrapper'

import { useNavigationMetadata } from '../layout/context'

const DashboardAccountRoutes: RouteButton[] = [
	{ to: '/dashboard/account', title: 'Profile' },
	{ to: '/dashboard/account/billing', title: 'Billing' },
	{ to: '/dashboard/account/notification', title: 'Notification' },
	{ to: '/dashboard/account/security', title: 'Security' },
]

export default function DashboardAccount() {
	const { navMetadata, setNavMetadata } = useNavigationMetadata()
	const navigating = navMetadata.showGlobalLoader === false

	return (
		<DashboardSectionWrapper>
			<DashboardHeader>
				<DashboardTitle>
					<AnimatedNav
						routes={DashboardAccountRoutes.map(route => ({
							...route,
							onClick: () => setNavMetadata({ showGlobalLoader: false }),
						}))}
					/>
				</DashboardTitle>
			</DashboardHeader>
			{navigating ? (
				<DashboardContent className="items-center justify-center">
					<Loading />
				</DashboardContent>
			) : (
				<Outlet />
			)}
		</DashboardSectionWrapper>
	)
}
