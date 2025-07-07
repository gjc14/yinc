import * as React from 'react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '~/components/ui/sidebar'
import type { Session } from '~/lib/auth/auth.server'
import {
	ServiceSwitcher,
	type ServiceDashboardConfig,
} from '~/routes/papa/dashboard/components/service-swicher'

import { NavMenu, type DashboardMenuItem } from './nav-menu'
import { NavSecondary, type NavSecondaryItem } from './nav-secondary'
import { NavUser } from './nav-user'

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	user: Session['user']
	services?: ServiceDashboardConfig[]
	currentService?: ServiceDashboardConfig
	mainNavItems?: DashboardMenuItem[]
	secondaryNavItems?: NavSecondaryItem[]
}

export function DashboardSidebar({
	user,
	services,
	currentService,
	mainNavItems,
	secondaryNavItems,
	...props
}: AppSidebarProps) {
	return (
		<Sidebar variant="inset" {...props}>
			{services && (
				<SidebarHeader>
					<ServiceSwitcher
						services={services}
						currentService={currentService}
					/>
				</SidebarHeader>
			)}
			{(mainNavItems || secondaryNavItems) && (
				<SidebarContent>
					{mainNavItems && <NavMenu items={mainNavItems} />}
					{secondaryNavItems && (
						<NavSecondary items={secondaryNavItems} className="mt-auto" />
					)}
				</SidebarContent>
			)}
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}
