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

const AdminAccountRoutes: RouteButton[] = [
	{ to: '/admin/account', title: 'Profile' },
	{ to: '/admin/account/billing', title: 'Billing' },
	{ to: '/admin/account/notification', title: 'Notification' },
	{ to: '/admin/account/security', title: 'Security' },
]

export default function AdminAccount() {
	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle>
					<AnimatedNav routes={AdminAccountRoutes} />
				</AdminTitle>
			</AdminHeader>
			<Outlet />
		</AdminSectionWrapper>
	)
}
