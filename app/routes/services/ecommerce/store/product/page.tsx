/**
 * Store Product Page is a component that could be dynamically rendered from database.
 */
import { Suspense } from 'react'
import { Await } from 'react-router'

import { Separator } from '~/components/ui/separator'

import {
	ProductCard,
	ProductCardSkeleton,
	type ProductCardProps,
} from './components/product-card'
import {
	ProductContent,
	type ProductContentProps,
} from './components/product-content'
import {
	ProductImageGallery,
	ProductImageGallerySkeleton,
	type ProductImageGalleryProps,
} from './components/product-image-gallery'

type StoreProductPageProps = ProductContentProps & {
	productGalleryPromise: Promise<ProductImageGalleryProps['productGallery']>
	crossSellProductsPromise: Promise<ProductCardProps['product'][]>
}

/**
 * Store product page component, displays product, image gallery, and cross-sell products.
 */
export function StoreProductPage(props: StoreProductPageProps) {
	const { product, productGalleryPromise, crossSellProductsPromise } = props

	return (
		<div className="relative w-full flex-1 space-y-16 px-3 md:px-8 xl:px-12">
			<div className="my-3 flex items-center justify-start gap-2">
				category {'>'} sub-category {'>'} {product.name}
			</div>
			<div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-8 lg:gap-16">
				<Suspense fallback={<ProductImageGallerySkeleton />}>
					<Await resolve={productGalleryPromise}>
						{productGallery => (
							<ProductImageGallery
								productName={product.name}
								productGallery={productGallery}
							/>
						)}
					</Await>
				</Suspense>
				<ProductContent product={product} />
			</div>

			{/* Cross Sell Section */}
			<div className="my-24">
				<Separator />
				<h2 className="mt-16 mb-8 text-2xl font-light">You may also like</h2>
				<div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
					<Suspense
						fallback={Array.from({ length: 3 }).map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					>
						<Await resolve={crossSellProductsPromise}>
							{crossSellProducts =>
								crossSellProducts.map(csp => (
									<ProductCard key={csp.id} product={csp} />
								))
							}
						</Await>
					</Suspense>
				</div>
			</div>
		</div>
	)
}
