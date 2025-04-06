import { Outlet, useOutletContext } from '@remix-run/react'

import { AnimatedNav, RouteButton } from '~/components/animated-horizontal-nav'
import {
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'
import { useAdminContext } from '../papa/admin/layout'

const AdminCompanyRoutes: RouteButton[] = [
    { to: '.', title: 'Profile' },
    { to: 'billing', title: 'Billing' },
    { to: 'notification', title: 'Notification' },
    { to: 'security', title: 'Security' },
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

export const useAccountContext = () => {
    return useOutletContext<typeof useAdminContext>()
}
