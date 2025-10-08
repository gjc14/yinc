import type {
	ProductAttribute,
	ProductVariant,
	ProductWithOption,
} from '../../../lib/db/product.server'
import type { ecBrand, ecCategory, ecTag } from '../../../lib/db/schema'

type ProductEditPageProps = {
	product:
		| (ProductWithOption & {
				categories: (typeof ecCategory.$inferSelect)[]
				tags: (typeof ecTag.$inferSelect)[]
				brands: (typeof ecBrand.$inferSelect)[]
				variants: ProductVariant[]
				attributes: ProductAttribute[]
		  })
		| null
}

export function ProductEditPage({ product }: ProductEditPageProps) {
	return <pre>{JSON.stringify({ product }, null, 2)}</pre>
}
