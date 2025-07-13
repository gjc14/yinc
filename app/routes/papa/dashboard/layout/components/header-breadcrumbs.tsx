import { useLocation } from 'react-router'

import { Breadcrumb, BreadcrumbList } from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { generateBreadcrumbs } from '~/lib/utils'

export const HeaderWithBreadcrumbs = () => {
	const location = useLocation()
	const breadcrumbPaths = generateBreadcrumbs(location.pathname)

	return (
		<header className="my-3 flex shrink-0 items-center gap-2">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>{breadcrumbPaths}</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	)
}
