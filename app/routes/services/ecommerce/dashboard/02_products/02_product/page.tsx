import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '~/components/ui/resizable'

import type { getProduct, ProductListing } from '../../../lib/db/product.server'
import { type productGallery } from '../../../lib/db/schema'
import { Header } from '../../../store/layout/components/header'
import { StoreProductPage } from '../../../store/product/page'

type ProductEditPageProps = {
	product: NonNullable<Awaited<ReturnType<typeof getProduct>>>
	productGalleryPromise: Promise<(typeof productGallery.$inferSelect)[]>
	crossSellProductsPromise: Promise<ProductListing[]>
}

export function ProductEditPage(props: ProductEditPageProps) {
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={50} minSize={10}>
				<section className="h-full w-full overflow-auto">
					{/* TODO: make sure it uses correct screen size when resized */}
					<Header />
					<StoreProductPage {...props} />
				</section>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={50} minSize={10}>
				<section className="h-full w-full overflow-auto">
					{/* General & Gallery */}
					{/* status & categories, tags, brands */}
					{/* attributes & options */}
				</section>
			</ResizablePanel>
		</ResizablePanelGroup>
	)
}
