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

const DashboardCompanyRoutes: RouteButton[] = [
	{ to: '/dashboard/company', title: 'Profile' },
	{ to: '/dashboard/company/billing', title: 'Billing' },
	{ to: '/dashboard/company/notification', title: 'Notification' },
	{ to: '/dashboard/company/security', title: 'Security' },
]

export default function DashboardCompany() {
	const { navMetadata, setNavMetadata } = useNavigationMetadata()
	const navigating = navMetadata.showGlobalLoader === false

	return (
		<DashboardSectionWrapper>
			<DashboardHeader>
				<DashboardTitle>
					<AnimatedNav
						routes={DashboardCompanyRoutes.map(route => ({
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
