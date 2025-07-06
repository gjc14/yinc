import { useState } from 'react'
import { NavLink } from 'react-router'

import { ChevronRight } from 'lucide-react'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '~/components/ui/collapsible'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '~/components/ui/sidebar'
import Icon from '~/components/dynamic-icon'
import type { PapaDashboardMenuItem } from '~/routes/plugins/utils/get-plugin-configs.server'

interface NavMenuProps {
	items: PapaDashboardMenuItem[]
	title?: string
	emptyMessage?: string
}

export function NavMenu({ items, title, emptyMessage }: NavMenuProps) {
	// Handle empty state for plugins
	if (emptyMessage && items.length <= 0) {
		return (
			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarGroupLabel>{emptyMessage}</SidebarGroupLabel>
			</SidebarGroup>
		)
	}

	return (
		<SidebarGroup
			className={title ? 'group-data-[collapsible=icon]:hidden' : ''}
		>
			{title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
			<SidebarMenu>
				{items.map(item => {
					const [open, setOpen] = useState(false)

					return (
						<Collapsible
							key={item.title}
							asChild
							open={open}
							onOpenChange={setOpen}
						>
							<SidebarMenuItem className="cursor-pointer">
								<NavLink
									to={
										'/dashboard' +
										(item.url.startsWith('/') ? item.url : `/${item.url}`)
									}
									end
								>
									{({ isActive }) => (
										<SidebarMenuButton
											tooltip={item.title}
											className={`cursor-pointer ${
												isActive
													? 'bg-sidebar-accent text-sidebar-accent-foreground'
													: ''
											}`}
										>
											<Icon name={item.iconName} />
											<span>{item.title}</span>
										</SidebarMenuButton>
									)}
								</NavLink>
								{item.sub?.length ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction className="data-[state=open]:rotate-90 cursor-pointer">
												<ChevronRight />
												<span className="sr-only">Toggle</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.sub?.map(subItem => (
													<SidebarMenuSubItem key={subItem.title}>
														<NavLink
															to={
																'/dashboard' +
																(item.url.startsWith('/')
																	? item.url
																	: `/${item.url}`) +
																(subItem.url.startsWith('/')
																	? subItem.url
																	: `/${subItem.url}`)
															}
															end
														>
															{({ isActive }) => (
																<SidebarMenuSubButton
																	className={
																		isActive
																			? 'bg-sidebar-accent text-sidebar-accent-foreground'
																			: ''
																	}
																	asChild
																>
																	<span>{subItem.title}</span>
																</SidebarMenuSubButton>
															)}
														</NavLink>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								) : null}
							</SidebarMenuItem>
						</Collapsible>
					)
				})}
			</SidebarMenu>
		</SidebarGroup>
	)
}
