import * as React from 'react'

import { Building, Command, LifeBuoy, Send, UserCog2 } from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '~/components/ui/sidebar'
import type { Session } from '~/lib/auth/auth.server'
import {
	ServiceSwicher,
	type ServiceSwicherProps,
} from '~/routes/papa/admin/components/service-swicher'
import type { PapaAdminMenuItem } from '~/routes/plugins/utils/get-plugin-configs.server'

import { NavMenu } from './nav-menu'
import { NavSecondary, type NavSecondaryItem } from './nav-secondary'
import { NavUser } from './nav-user'

const services: ServiceSwicherProps['services'] = [
	{
		name: 'Papa',
		logo: () => <Command className="size-4" />,
		plan: 'Startup',
		url: '/admin',
	},
]

const MainNavItems: PapaAdminMenuItem[] = [
	{
		iconName: 'user-round',
		title: 'Users',
		url: 'users',
	},
	{
		iconName: 'pen',
		title: 'Blog',
		url: 'blog',
		sub: [{ title: 'Categories / Tags', url: 'taxonomy' }],
	},
	{ iconName: 'text-search', title: 'SEO', url: 'seo' },
	{ iconName: 'cloud', title: 'Assets', url: 'assets' },
]

const SecondaryNavItems: NavSecondaryItem[] = [
	{
		title: 'Support',
		action: () => {
			alert('Support')
		},
		icon: LifeBuoy,
	},
	{
		title: 'Feedback',
		action: () => {
			alert('Feedback')
		},
		icon: Send,
	},
	{
		title: 'Company',
		url: '/admin/company',
		icon: Building,
	},
	{
		title: 'Admins',
		url: '/admin/admins',
		icon: UserCog2,
	},
]

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	pluginRoutes: PapaAdminMenuItem[]
	user: Session['user']
}

export function AdminSidebar({
	user,
	pluginRoutes,
	...props
}: AppSidebarProps) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<ServiceSwicher services={services} />
			</SidebarHeader>
			<SidebarContent>
				<NavMenu items={MainNavItems} />
				<NavMenu
					items={pluginRoutes}
					title="Plugins"
					emptyMessage="No plugin"
				/>
				<NavSecondary items={SecondaryNavItems} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}
