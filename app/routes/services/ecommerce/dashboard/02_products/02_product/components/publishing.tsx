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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'

import { ProductStatus, ProductVisibility } from '../../../../lib/db/schema'
import { productAtom } from '../context'

export function Publishing() {
	const [product, setProduct] = useAtom(productAtom)

	const handleProductChange = (updatedProduct: Partial<typeof product>) => {
		setProduct(prev => prev && { ...prev, ...updatedProduct })
	}

	if (!product) return null

	return (
		<Card>
			<CardHeader>
				<CardTitle>Publishing</CardTitle>
				<CardDescription>Control product status and visibility</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Field>
					<FieldLabel htmlFor="p-status">Status</FieldLabel>
					<Select
						value={product.status}
						onValueChange={value =>
							handleProductChange({
								status: value as typeof product.status,
							})
						}
					>
						<SelectTrigger id="p-status">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ProductStatus.map(status => (
								<SelectItem key={status} value={status}>
									{status}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>

				{product.status === 'SCHEDULED' && (
					<Field>
						<FieldLabel htmlFor="p-published-at">
							Publish Date & Time
						</FieldLabel>
						<Input
							id="p-published-at"
							type="datetime-local"
							value={
								product.publishedAt
									? new Date(product.publishedAt).toISOString().slice(0, 16)
									: ''
							}
						/>
						<FieldDescription>
							Schedule when this product goes live
						</FieldDescription>
					</Field>
				)}

				<Separator />

				<Field>
					<FieldLabel htmlFor="p-visibility">Visibility</FieldLabel>
					<Select
						value={product.visibility}
						onValueChange={value =>
							handleProductChange({
								visibility: value as typeof product.visibility,
							})
						}
					>
						<SelectTrigger id="p-visibility">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ProductVisibility.map(visibility => (
								<SelectItem key={visibility} value={visibility}>
									{visibility}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>

				{product.visibility === 'PROTECTED' && (
					<Field>
						<FieldLabel htmlFor="p-password">Password</FieldLabel>
						<Input
							id="p-password"
							name="password"
							type="password"
							placeholder="Enter protection password"
							value={product.password || ''}
							onChange={e => handleProductChange({ password: e.target.value })}
						/>
						<FieldDescription>
							Required password to view this product
						</FieldDescription>
					</Field>
				)}
			</CardContent>
		</Card>
	)
}
