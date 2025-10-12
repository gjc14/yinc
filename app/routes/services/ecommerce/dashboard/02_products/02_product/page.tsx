import { useMemo, useState } from 'react'
import { Form } from 'react-router'

import { useAtom } from 'jotai'

import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '~/components/ui/resizable'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'

import { ProductStatus, ProductVisibility } from '../../../lib/db/schema'
import { Header } from '../../../store/layout/components/header'
import { StoreProductPage } from '../../../store/product/page'
import {
	crossSellProductsAtom,
	productAtom,
	productGalleryAtom,
} from './context'

export function ProductEditPage() {
	const [preview, setPreview] = useState(true)

	const [product, setProduct] = useAtom(productAtom)
	const [crossSellProducts] = useAtom(crossSellProductsAtom)
	const [productGallery] = useAtom(productGalleryAtom)

	// Create reactive promises that resolve with current atom values
	// When atom is null, promise resolves to empty array to prevent serveer unsolved promises
	// When atom has data, promise resolves immediately (preview updates)
	const productGalleryPromise = useMemo((): Promise<
		NonNullable<typeof productGallery>
	> => {
		if (productGallery === null) {
			return Promise.resolve([])
		}
		return Promise.resolve(productGallery)
	}, [productGallery])

	const crossSellProductsPromise = useMemo((): Promise<
		NonNullable<typeof crossSellProducts>
	> => {
		if (crossSellProducts === null) {
			return Promise.resolve([])
		}
		return Promise.resolve(crossSellProducts)
	}, [crossSellProducts])

	const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		console.log('Saving product:', product)
		// TODO: Implement save logic
	}

	const handleProductChange = (updatedProduct: Partial<typeof product>) => {
		setProduct(prev => prev && { ...prev, ...updatedProduct })
	}

	if (!product) {
		return null
	}

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel className="@container" defaultSize={50} minSize={30}>
				<section className="relative h-full w-full overflow-auto">
					{/* Sticky Header */}
					<header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
						<div className="flex flex-wrap items-center justify-between gap-3 p-4">
							<div className="flex items-center gap-3">
								<h1 className="text-xl font-semibold">
									{product.id !== -1 ? 'Edit' : 'Create'}: {product.name}
								</h1>
								{product.id !== -1 && ( // new products have id -1
									<span className="text-muted-foreground text-sm">
										ID: {product.id}
									</span>
								)}
							</div>
							<div className="flex items-center gap-3">
								<Label htmlFor="preview" className="text-sm">
									Preview
								</Label>
								<Switch
									id="preview"
									checked={preview}
									onCheckedChange={setPreview}
								/>
								<Separator orientation="vertical" className="h-6" />
								<Button size="sm" variant="outline" type="button">
									Restore
								</Button>
								<Button size="sm" type="submit" form="product-edit-form">
									Save
								</Button>
							</div>
						</div>
					</header>

					<Form
						id="product-edit-form"
						onSubmit={handleSave}
						method="POST"
						className="p-4"
					>
						<p className="text-muted-foreground mb-4 rounded-lg border bg-violet-300/20 p-3 text-sm @xl:mb-6 dark:bg-violet-700/20">
							<strong>Instructions:</strong> Fill in the product details below.
							The left column contains general information, attributes, and
							variants. The right column manages status, visibility, and
							taxonomies (categories, tags, brands). Use the preview panel to
							see how your product will appear to customers.
						</p>

						<div className="grid grid-cols-1 gap-6 @xl:grid-cols-5">
							{/* Left Column - General Info & Attributes */}
							<div className="space-y-6 @xl:col-span-3">
								{/* General Information */}
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
												onChange={e =>
													handleProductChange({ name: e.target.value })
												}
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
												onChange={e =>
													handleProductChange({ subtitle: e.target.value })
												}
											/>
											<FieldDescription>
												Optional tagline displayed below product name
											</FieldDescription>
										</Field>

										<Field>
											<FieldLabel htmlFor="p-description">
												Description
											</FieldLabel>
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
											<FieldLabel htmlFor="p-purchase-note">
												Purchase Note
											</FieldLabel>
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
							</div>

							{/* Right Column - Status & Taxonomies */}
							<div className="space-y-6 @xl:col-span-2">
								{/* Status & Visibility */}
								<Card>
									<CardHeader>
										<CardTitle>Publishing</CardTitle>
										<CardDescription>
											Control product status and visibility
										</CardDescription>
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
															? new Date(product.publishedAt)
																	.toISOString()
																	.slice(0, 16)
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
													onChange={e =>
														handleProductChange({ password: e.target.value })
													}
												/>
												<FieldDescription>
													Required password to view this product
												</FieldDescription>
											</Field>
										)}
									</CardContent>
								</Card>
							</div>
						</div>
					</Form>
				</section>
			</ResizablePanel>

			{preview && (
				<>
					<ResizableHandle />
					<ResizablePanel defaultSize={50} minSize={30}>
						<section className="h-full w-full overflow-auto">
							<Header />
							<StoreProductPage
								product={product}
								productGalleryPromise={productGalleryPromise}
								crossSellProductsPromise={crossSellProductsPromise}
							/>
						</section>
					</ResizablePanel>
				</>
			)}
		</ResizablePanelGroup>
	)
}
