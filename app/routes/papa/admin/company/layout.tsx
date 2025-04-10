import { Outlet, useOutletContext } from 'react-router'

import {
	AnimatedNav,
	type RouteButton,
} from '~/components/animated-horizontal-nav'
import {
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'

import { useAdminContext } from '../layout'

const AdminCompanyRoutes: RouteButton[] = [
	{ to: '/admin/company', title: 'Profile' },
	{ to: '/admin/company/billing', title: 'Billing' },
	{ to: '/admin/company/notification', title: 'Notification' },
	{ to: '/admin/company/security', title: 'Security' },
]

export default function AdminCompany() {
	const admin = useAdminContext()

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle className="w-full">
					<AnimatedNav routes={AdminCompanyRoutes} />
				</AdminTitle>
			</AdminHeader>
			<Outlet context={admin} />
		</AdminSectionWrapper>
	)
}

export const useCompanyContext = () => {
	return useOutletContext<ReturnType<typeof useAdminContext>>()
}
