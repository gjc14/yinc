import { useState } from 'react'

import { useAtom } from 'jotai'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'

import { productGallery as productGalleryTable } from '../../../lib/db/schema'
import { productAtom, productGalleryAtom } from '../context'

const ProductImageGalleryWrapper = ({
	sticky = true,
	children,
}: {
	sticky?: boolean
	children?: React.ReactNode
}) => {
	return (
		<div className={`${sticky ? 'md:sticky md:top-16' : ''} h-min`}>
			{children}
		</div>
	)
}

export type ProductGallery = (typeof productGalleryTable.$inferSelect)[]

export const ProductImageGallery = () => {
	const [product] = useAtom(productAtom)
	const [productGallery] = useAtom(productGalleryAtom)

	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	if (!product) return null

	const productName = product.name

	const nextImage = () => {
		if (!productGallery) return
		setCurrentImageIndex(prev => (prev + 1) % productGallery.length)
	}

	const prevImage = () => {
		if (!productGallery) return
		setCurrentImageIndex(
			prev => (prev - 1 + productGallery.length) % productGallery.length,
		)
	}

	// Handle empty gallery
	if (!productGallery || productGallery.length === 0) {
		return (
			<ProductImageGalleryWrapper sticky={true}>
				<div className="bg-muted flex aspect-square w-full items-center justify-center">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</ProductImageGalleryWrapper>
		)
	}

	return (
		<ProductImageGalleryWrapper sticky={true}>
			<div className="relative">
				<img
					src={productGallery[currentImageIndex].image}
					alt={productName}
					className="aspect-square w-full object-cover"
				/>
				{productGallery.length > 1 && (
					<>
						<Button
							onClick={prevImage}
							className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/60 text-black transition-colors hover:bg-white"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<Button
							onClick={nextImage}
							className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/60 text-black transition-colors hover:bg-white"
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</>
				)}
			</div>
			<div className="mt-4 flex gap-2">
				{productGallery.map((img, idx) => (
					<button
						key={idx}
						onClick={() => setCurrentImageIndex(idx)}
						className={`h-20 w-20 cursor-pointer border-2 transition-colors ${
							idx === currentImageIndex
								? 'border-primary'
								: 'border-transparent'
						}`}
					>
						<img
							src={img.image}
							alt={img.alt || productName}
							title={img.title || productName}
							className="h-full w-full object-cover"
						/>
					</button>
				))}
			</div>
		</ProductImageGalleryWrapper>
	)
}

export const ProductImageGallerySkeleton = ({
	sticky = true,
}: {
	sticky?: boolean
}) => {
	return (
		<ProductImageGalleryWrapper sticky={sticky}>
			{/* Main image skeleton */}
			<Skeleton className="aspect-square w-full rounded-none" />

			{/* Thumbnail gallery skeleton */}
			<div className="mt-4 flex gap-2">
				{[...Array(3)].map((_, idx) => (
					<Skeleton key={idx} className="h-20 w-20 rounded-none" />
				))}
			</div>
		</ProductImageGalleryWrapper>
	)
}
