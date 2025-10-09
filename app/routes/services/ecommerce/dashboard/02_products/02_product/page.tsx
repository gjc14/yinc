import { useIsMobile } from '~/hooks/use-mobile'
import {
	DashboardContent,
	DashboardSectionWrapper,
} from '~/routes/papa/dashboard/components/dashboard-wrapper'

import type { getProduct, ProductListing } from '../../../lib/db/product.server'
import type { productGallery } from '../../../lib/db/schema'
import { Header } from '../../../store/layout/components/header'
import { StoreProductPage } from '../../../store/product/page'

type ProductEditPageProps = {
	product: NonNullable<Awaited<ReturnType<typeof getProduct>>>
	productGalleryPromise: Promise<(typeof productGallery.$inferSelect)[]>
	crossSellProductsPromise: Promise<ProductListing[]>
}

export function ProductEditPage(props: ProductEditPageProps) {
	const isMobile = useIsMobile()

	return (
		<DashboardSectionWrapper>
			<DashboardContent className="grid grid-cols-1 md:grid-cols-2">
				{!isMobile && (
					<section className="relative hidden overflow-scroll border md:block">
						<Header />
						<StoreProductPage {...props} />
					</section>
				)}

				<section className="relative flex flex-col gap-2 overflow-scroll">
					Edit Product Section
				</section>
			</DashboardContent>
		</DashboardSectionWrapper>
	)
}
