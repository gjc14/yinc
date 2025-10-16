import { useState } from 'react'
import { Link } from 'react-router'

import { useAtom } from 'jotai'
import { ExternalLink } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '~/components/ui/resizable'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'

import { Header } from '../../../store/layout/components/header'
import { productAtom, storeConfigAtom } from '../../../store/product/context'
import { StoreProductPage } from '../../../store/product/page'
import { Attributes } from './components/attributes'
import { Details } from './components/details'
import { Gallery } from './components/gallery'
import { GeneralInformation } from './components/general-information'
import { LinkedProducts } from './components/linked-products'
import { MainOption } from './components/main-option'
import { Publishing } from './components/publishing'
import { Taxonomies } from './components/taxonomies'
import { Variants } from './components/variants'

export function ProductEditPage() {
	const [preview, setPreview] = useState(false)

	const [storeConfig] = useAtom(storeConfigAtom)
	const [product] = useAtom(productAtom)

	if (!product) return null

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
								<Button
									variant={'ghost'}
									size={'icon'}
									asChild
									className="size-8"
								>
									<Link
										to={`${storeConfig.storeFrontPath}/product/${product.slug}`}
										target="_blank"
										rel="noreferrer"
									>
										<ExternalLink />
									</Link>
								</Button>
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

					<div className="p-4">
						<p className="text-muted-foreground mb-4 rounded-lg border bg-violet-300/20 p-3 text-sm @xl:mb-6 dark:bg-violet-700/20">
							<strong>Instructions:</strong> Add attributes (options) to your
							product, and use them to generate variants. Use the preview panel
							to see how your product will appear to customers.
						</p>

						<div className="grid grid-cols-1 gap-6 @xl:grid-cols-5">
							{/* Left Column */}
							<div className="space-y-6 @xl:col-span-3">
								<GeneralInformation />
								<Details />
								<MainOption />
								{/* Specifications / Options */}
								<Attributes />
								<Variants />
								<LinkedProducts />
								{/* TODO: SEO */}
							</div>

							{/* Right Column */}
							<div className="space-y-6 @xl:col-span-2">
								<Publishing />
								<Gallery />
								<Taxonomies />
							</div>
						</div>
					</div>
				</section>
			</ResizablePanel>

			{preview && (
				<>
					<ResizableHandle />
					<ResizablePanel className="@container" defaultSize={50} minSize={30}>
						<section className="h-full w-full overflow-auto">
							<Header />
							<StoreProductPage />
						</section>
					</ResizablePanel>
				</>
			)}
		</ResizablePanelGroup>
	)
}
