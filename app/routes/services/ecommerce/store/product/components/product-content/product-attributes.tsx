import { Separator } from '~/components/ui/separator'

import { useProductPage } from '../../hooks/use-product-page'

export const ProductAttributes = () => {
	const { product } = useProductPage()
	if (!product || !product.attributes || product.attributes.length === 0)
		return null

	const visibleAttributes = product.attributes.filter(
		attr => attr.visible === 1,
	)

	if (visibleAttributes.length === 0) return null
	return (
		<div>
			<Separator />
			<h3 className="mt-8 mb-4 text-sm font-medium tracking-wide uppercase">
				Specifications
			</h3>
			<dl className="space-y-3">
				{visibleAttributes.map(attr => (
					<div
						key={attr.id}
						className="flex justify-between gap-3 text-end text-sm"
					>
						<dt className="text-primary/60">{attr.name}</dt>
						<dd className="font-medium">{attr.value}</dd>
					</div>
				))}
			</dl>
		</div>
	)
}
