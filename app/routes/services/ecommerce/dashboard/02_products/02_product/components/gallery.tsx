import { useAtom } from 'jotai'
import { X } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'

import { productAtom, productGalleryAtom } from '../context'

export function Gallery() {
	const [gallery, setGallery] = useAtom(productGalleryAtom)
	const [product] = useAtom(productAtom)

	if (!product) return null

	if (!gallery) return null // TODO: skeleton

	return (
		<Card className="p-3">
			<div className="grid grid-cols-3 gap-2">
				{gallery.map((item, i) => (
					<div key={i} className="relative">
						<img
							key={i}
							src={item.image}
							alt={item.alt || product.name}
							title={item.title || product.name}
							className="aspect-square rounded object-cover"
						/>
						<button
							type="button"
							onClick={() => {
								const newGallery = gallery.filter((_, index) => index !== i)
								setGallery(newGallery)
							}}
							className="bg-destructive text-destructive-foreground absolute top-0.5 right-0.5 cursor-pointer rounded-full p-0.5 hover:opacity-80"
						>
							<X size={12} />
						</button>
					</div>
				))}
			</div>
			<Button size="sm" className="mt-2 w-full">
				Add Image
			</Button>
		</Card>
	)
}
