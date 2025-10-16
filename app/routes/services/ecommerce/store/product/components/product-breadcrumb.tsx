import { Link } from 'react-router'

import { useAtom } from 'jotai'
import { ChevronDownIcon } from 'lucide-react'

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

import { productAtom, storeConfigAtom } from '../context'

export function ProductBreadcrumb() {
	const [store] = useAtom(storeConfigAtom)
	const [product] = useAtom(productAtom)

	if (!product) return null

	const categories = product.categories

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className="text-sm">
					<BreadcrumbLink asChild>
						<Link to={store?.storeFrontPath || '/store'}>Store</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{categories.length > 0 && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem className="text-sm">
							{categories.length > 1 ? (
								<DropdownMenu>
									<DropdownMenuTrigger className="flex items-center gap-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5">
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

				<BreadcrumbSeparator />
				<BreadcrumbItem className="text-sm">
					<BreadcrumbPage>{product.name}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	)
}
