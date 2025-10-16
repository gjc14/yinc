import { Link } from 'react-router'

import { ChevronDownIcon, Slash } from 'lucide-react'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

import { useProductContext } from '../hooks/use-product-context'

export function ProductBreadcrumb() {
	const { storeConfig, product } = useProductContext()

	if (!product) return null

	const categories = product.categories

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className="text-sm">
					<BreadcrumbLink asChild>
						<Link to={storeConfig?.storeFrontPath || '/store'}>Store</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{categories.length > 0 && (
					<>
						<BreadcrumbSeparator>
							<Slash />
						</BreadcrumbSeparator>

						<BreadcrumbItem className="text-sm">
							{categories.length > 1 ? (
								<DropdownMenu>
									<DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5">
										{categories[0].name}
										<ChevronDownIcon />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										{categories.map(cat => (
											<DropdownMenuItem key={cat.id} asChild>
												<Link to={`../categories/${cat.slug}`}>{cat.name}</Link>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<BreadcrumbLink asChild>
									<Link to={`../categories/${categories[0].slug}`}>
										{categories[0].name}
									</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
					</>
				)}

				<BreadcrumbSeparator>
					<Slash />
				</BreadcrumbSeparator>

				<BreadcrumbItem className="text-sm">
					<BreadcrumbPage>{product.name}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	)
}
