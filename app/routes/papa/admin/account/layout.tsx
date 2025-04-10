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

const AdminAccountRoutes: RouteButton[] = [
	{ to: '/admin/account', title: 'Profile' },
	{ to: '/admin/account/billing', title: 'Billing' },
	{ to: '/admin/account/notification', title: 'Notification' },
	{ to: '/admin/account/security', title: 'Security' },
]

export default function AdminAccount() {
	const admin = useAdminContext()

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle>
					<AnimatedNav routes={AdminAccountRoutes} />
				</AdminTitle>
			</AdminHeader>
			<Outlet context={admin} />
		</AdminSectionWrapper>
	)
}

export const useAccountContext = () => {
	return useOutletContext<ReturnType<typeof useAdminContext>>()
}
