import { Link } from 'react-router'

import { ChevronsUpDown } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '~/components/ui/sidebar'

export interface ServiceDashboardConfig {
	/**
	 * Name of the service.
	 */
	name: string
	/**
	 * Can be a React component or an image URL
	 * ```
	 * // For React component, use:
	 * import { Command } from 'lucide-react'
	 * // ...
	 * logo: Command
	 *
	 * // For image URL, use:
	 * logo: '/your-logo.png'
	 *
	 * // For SVG/PNG path, use:
	 * import mySVGLogo from './my-logo.svg'
	 * import myPNGLogo from './my-logo.png'
	 * // ...
	 * logo: mySVGLogo
	 * ```
	 */
	logo: React.ElementType | string
	/**
	 * The URL path for the service, e.g., '/my-service'
	 */
	pathname: string
}

export function ServiceSwitcher({
	services,
	currentService,
}: {
	services: ServiceDashboardConfig[]
	currentService?: ServiceDashboardConfig
}) {
	const { isMobile } = useSidebar()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					{currentService && (
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg border text-sidebar-primary-foreground overflow-hidden">
									{renderLogo(currentService.logo, 'lg')}
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{currentService.name}
									</span>
									<span className="truncate text-xs">{'Start Up'}</span>
								</div>
								<ChevronsUpDown className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
					)}
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							Services
						</DropdownMenuLabel>
						{services.map(service => (
							<Link key={service.name} to={service.pathname}>
								<DropdownMenuItem className="gap-2 p-2">
									<div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
										{renderLogo(service.logo, 'sm')}
									</div>
									{service.name}
									{/* <DropdownMenuShortcut>
                                    ⌘{index + 1}
                                </DropdownMenuShortcut> */}
								</DropdownMenuItem>
							</Link>
						))}
						{/* <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">
                                Add service
                            </div>
                        </DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

// Helper function to render different types of logos
const renderLogo = (logo: React.ElementType | string, size?: 'sm' | 'lg') => {
	// If it's a string, treat it as an image URL or SVG path
	if (typeof logo === 'string') {
		const imageClasses =
			size === 'sm' ? 'size-6 object-cover' : 'size-8 object-cover'
		return <img src={logo} alt="Service logo" className={imageClasses} />
	}

	// If it's a React component (like Lucide icons)
	const LogoComponent = logo
	const iconClasses = size === 'sm' ? 'size-6 scale-70' : 'size-8 scale-80 p-1'
	return <LogoComponent className={iconClasses} />
}
