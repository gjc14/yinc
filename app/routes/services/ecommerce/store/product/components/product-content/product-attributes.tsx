import { Separator } from '~/components/ui/separator'

import type { Product } from '../../context'

export const ProductAttributes = ({
	productAttributes,
}: {
	productAttributes: NonNullable<Product>['attributes']
}) => {
	const visibleAttributes = productAttributes.filter(attr => attr.visible === 1)

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
