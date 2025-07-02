import type { Route } from './+types/layout'
import { Outlet } from 'react-router'

import {
	AnimatedNav,
	type RouteButton,
} from '~/components/animated-horizontal-nav'
import {
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'

const AdminCompanyRoutes: RouteButton[] = [
	{ to: '/admin/company', title: 'Profile' },
	{ to: '/admin/company/billing', title: 'Billing' },
	{ to: '/admin/company/notification', title: 'Notification' },
	{ to: '/admin/company/security', title: 'Security' },
]

export default function AdminCompany({}: Route.ComponentProps) {
	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle className="w-full">
					<AnimatedNav routes={AdminCompanyRoutes} />
				</AdminTitle>
			</AdminHeader>
			<Outlet />
		</AdminSectionWrapper>
	)
}
