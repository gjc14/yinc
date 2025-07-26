import React from 'react'
import { NavLink, useLocation } from 'react-router'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { capitalize } from '~/lib/utils'

export const HeaderWithBreadcrumbs = () => {
	return (
		<header className="my-2 flex shrink-0 items-center gap-2">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1 cursor-pointer" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<DashboardBreadcrumbs />
			</div>
		</header>
	)
}

const DashboardBreadcrumbs = () => {
	const { pathname } = useLocation()
	const paths = pathname.split('/').filter(Boolean)

	const getPathName = (path: string) => {
		return decodeURIComponent(path)
			.replace(/[-_]/g, ' ')
			.split(' ')
			.map(word => capitalize(word))
			.join(' ')
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{paths.map((path, i) => {
					const link = `/${paths.slice(0, i + 1).join('/')}`
					const name = getPathName(path)

					return (
						<React.Fragment key={i}>
							<Tooltip>
								<TooltipProvider>
									<TooltipTrigger asChild>
										<BreadcrumbItem>
											<NavLink
												to={link}
												className={({ isActive }) =>
													`${isActive ? 'text-primary' : 'hover:text-primary'} max-w-32 overflow-hidden text-sm text-nowrap text-ellipsis`
												}
												end
											>
												{name}
											</NavLink>
										</BreadcrumbItem>
									</TooltipTrigger>
									<TooltipContent>{name}</TooltipContent>
								</TooltipProvider>
							</Tooltip>
							{/* Add separator except last one */}
							{i < paths.length - 1 && (
								<BreadcrumbSeparator className="size-3" />
							)}
						</React.Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
