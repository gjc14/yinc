import { useAtom } from 'jotai'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

import { productAtom } from '../../../../store/product/context'

export function GeneralInformation() {
	const [product, setProduct] = useAtom(productAtom)

	const handleProductChange = (updatedProduct: Partial<typeof product>) => {
		setProduct(prev => prev && { ...prev, ...updatedProduct })
	}

	if (!product) return null

	return (
		<Card>
			<CardHeader>
				<CardTitle>General Information</CardTitle>
				<CardDescription>
					Basic product details and descriptions
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Field>
					<FieldLabel htmlFor="p-name">Product Name</FieldLabel>
					<Input
						id="p-name"
						name="name"
						placeholder="Taiwan Formosa Oolong Tea"
						value={product.name}
						onChange={e => handleProductChange({ name: e.target.value })}
						required
						autoFocus
					/>
				</Field>

				<Field>
					<FieldLabel htmlFor="p-subtitle">Subtitle</FieldLabel>
					<Input
						id="p-subtitle"
						name="subtitle"
						placeholder="A short one-liner about your product"
						value={product.subtitle || ''}
						onChange={e => handleProductChange({ subtitle: e.target.value })}
					/>
					<FieldDescription>
						Optional tagline displayed below product name
					</FieldDescription>
				</Field>

				<Field>
					<FieldLabel htmlFor="p-description">Description</FieldLabel>
					<Textarea
						id="p-description"
						name="description"
						placeholder="Detailed product description..."
						value={product.description || ''}
						onChange={e =>
							handleProductChange({
								description: e.target.value,
							})
						}
						rows={5}
					/>
					<FieldDescription>
						Main product description shown on the product page
					</FieldDescription>
				</Field>

				<Field>
					<FieldLabel htmlFor="p-purchase-note">Purchase Note</FieldLabel>
					<Textarea
						id="p-purchase-note"
						name="purchaseNote"
						placeholder="Special instructions or notes after purchase..."
						value={product.purchaseNote || ''}
						onChange={e =>
							handleProductChange({
								purchaseNote: e.target.value,
							})
						}
						rows={3}
					/>
					<FieldDescription>
						Note displayed to customer after purchasing
					</FieldDescription>
				</Field>
			</CardContent>
		</Card>
	)
}
