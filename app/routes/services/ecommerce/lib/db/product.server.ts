import camelcaseKeys from 'camelcase-keys'
import { eq, inArray, sql } from 'drizzle-orm'

import { seo } from '~/lib/db/schema'
import { convertDateFields } from '~/lib/db/utils'

import { dbStore, type TransactionType } from './db.server'
import {
	product,
	productAttribute,
	productCrossSell,
	productOption,
	productToBrand,
	productToCategory,
	productToTag,
	productUpsell,
	productVariant,
	type ProductStatus,
} from './schema/product'
import { ecAttribute, ecBrand, ecCategory, ecTag } from './schema/taxonomy'

type Product = typeof product.$inferSelect
type ProductOption = typeof productOption.$inferSelect
type Category = typeof ecCategory.$inferSelect
type Tag = typeof ecTag.$inferSelect
type Brand = typeof ecBrand.$inferSelect

export type ProductListing = Pick<
	Product,
	'id' | 'name' | 'slug' | 'status' | 'updatedAt'
> & {
	option: Pick<
		ProductOption,
		| 'id'
		| 'image'
		| 'price'
		| 'salePrice'
		| 'scale'
		| 'currency'
		| 'sku'
		| 'manageStock'
		| 'stockStatus'
		// TODO: add stockQuantity if manageStock is 1
	>
}

export type ProductListingWithRelations = ProductListing & {
	categories: Category[]
	tags: Tag[]
	brands: Brand[]
}

type GetProductsParamsBase = {
	/** Filter by product status (default: 'PUBLISHED'). Use 'ALL' to fetch all statuses. */
	status?: ProductStatus | 'ALL'
	/** Array of category slugs to filter products by category. */
	categories?: string[]
	/** Array of tag slugs to filter products by tags. */
	tags?: string[]
	/** Array of brand slugs to filter products by brands. */
	brands?: string[]
	/** Array of attribute slugs to filter products by attributes. */
	attributes?: string[]
	/** Search term to filter products by name (case-insensitive, partial match). */
	title?: string
}

type PriceFields = {
	price: bigint
	salePrice: bigint | null
}

function convertPriceStringToBigInt<T extends PriceFields>(data: T): T {
	const result = { ...data }

	if (typeof result.price === 'string') {
		result.price = BigInt(result.price)
	}

	if (typeof result.salePrice === 'string') {
		result.salePrice = BigInt(result.salePrice)
	}

	return result
}

export async function getProducts(
	params?: GetProductsParamsBase & {
		relations?: false
	},
): Promise<ProductListing[]>
export async function getProducts(
	params: GetProductsParamsBase & {
		relations: true
	},
): Promise<ProductListingWithRelations[]>
/**
 * Fetch compact products for listing purpose from the database with optional filters.
 * @returns An object containing an array of products matching the filters.
 */
export async function getProducts({
	status = 'PUBLISHED',
	categories = [],
	tags = [],
	attributes = [],
	brands = [],
	title,
	relations = false,
}: GetProductsParamsBase & { relations?: boolean } = {}) {
	console.time('getProducts')
	const products = await dbStore.execute<
		ProductListing | ProductListingWithRelations
	>(sql`
		SELECT
		DISTINCT ON (p.id)
			p.id,
			p.name,
			p.slug,
			p.status,
			p.updated_at,
			CASE
				WHEN po.id IS NOT NULL 
				THEN json_build_object(
					'id', po.id,
					'image', po.image,
					'price', po.price::text,
					'sale_price', po.sale_price::text,
					'scale', po.scale,
					'currency', po.currency,
					'sku', po.sku,
					'manage_stock', po.manage_stock,
					'stock_status', po.stock_status
				)
				ELSE NULL 
       		END AS option
			${
				relations
					? sql`
						,
						COALESCE(
							(
								SELECT json_agg(c)
								FROM ${productToCategory} pc
								LEFT JOIN ${ecCategory} c ON pc.category_id = c.id
								WHERE pc.product_id = p.id
							),
							'[]'::json
						) AS categories,
						COALESCE(
							(
								SELECT json_agg(t)
								FROM ${productToTag} pt
								LEFT JOIN ${ecTag} t ON pt.tag_id = t.id
								WHERE pt.product_id = p.id
							),
							'[]'::json
						) AS tags,
						COALESCE(
							(
								SELECT json_agg(b)
								FROM ${productToBrand} pb
								LEFT JOIN ${ecBrand} b ON pb.brand_id = b.id
								WHERE pb.product_id = p.id
							),
							'[]'::json
						) AS brands`
					: undefined
			}

		FROM ${product} p
		LEFT JOIN ${productOption} po ON p.product_option_id = po.id

		LEFT JOIN ${productToTag} ptt ON p.id = ptt.product_id
		LEFT JOIN ${ecTag} et ON ptt.tag_id = et.id

		LEFT JOIN ${productToCategory} ptc ON p.id = ptc.product_id
		LEFT JOIN ${ecCategory} ec ON ptc.category_id = ec.id

		LEFT JOIN ${productToBrand} ptb ON p.id = ptb.product_id
		LEFT JOIN ${ecBrand} eb ON ptb.brand_id = eb.id

		WHERE
			${status !== 'ALL' ? sql`p.status = ${status}` : sql`TRUE`}
			AND	${title ? sql`p.name ILIKE ${'%' + title + '%'}` : sql`TRUE`}
			AND	${categories.length ? sql`ec.slug = ANY(ARRAY[${sql.join(categories, sql`,`)}])` : sql`TRUE`}
			AND	${tags.length ? sql`et.slug = ANY(ARRAY[${sql.join(tags, sql`,`)}])` : sql`TRUE`}
			AND	${brands.length ? sql`eb.slug = ANY(ARRAY[${sql.join(brands, sql`,`)}])` : sql`TRUE`}
			AND	${attributes.length ? sql`ea.slug = ANY(ARRAY[${sql.join(attributes, sql`,`)}])` : sql`TRUE`}
	`)
	console.timeEnd('getProducts')

	const validProducts = convertDateFields(
		camelcaseKeys(products.rows, { deep: true }),
		['updatedAt'],
	).filter(product => {
		if (!product.option) {
			console.error(`Product ${product.id} has no productOption`)
			return false
		}
		return true
	})

	return validProducts.map(p => ({
		...p,
		option: convertPriceStringToBigInt(p.option),
	}))
}

export type ProductWithOption = Product & {
	option: ProductOption
}

/** Single product select attribute type */
export type ProductVariant = typeof productVariant.$inferSelect & {
	option: ProductOption
}

/** Single product select attribute type */
export type ProductAttribute = Omit<
	typeof productAttribute.$inferSelect,
	'productId'
>

/**
 * Fetch a single product by its slug from the database, including its option and related taxonomy.
 * @param slug - The slug of the product to fetch.
 * @param preview - If true, fetch the product regardless of its status. Defaults to false.
 * @returns The product with its option and related taxonomy, or null if not found.
 */
export const getProduct = async ({
	slug,
	preview = false,
	edit = false,
	status = 'PUBLISHED',
}: {
	slug: string
	preview?: boolean
	edit?: boolean
	status?: ProductStatus
}) => {
	console.time('getProduct')
	const products = await dbStore.execute<
		ProductWithOption & {
			categories: Category[]
			tags: Tag[]
			brands: Brand[]
			variants: ProductVariant[]
			attributes: ProductAttribute[]
		}
	>(sql`
		SELECT
		DISTINCT ON (p.id)
			p.*,
			CASE 
                WHEN po.id IS NOT NULL 
                THEN
					(row_to_json(po.*)::jsonb - 'price' - 'sale_price')
					|| jsonb_build_object('price', po.price::text, 'sale_price', po.sale_price::text)
                ELSE NULL 
            END AS option,
			COALESCE(
				(
					SELECT json_agg(c)
					FROM ${productToCategory} pc
					LEFT JOIN ${ecCategory} c ON pc.category_id = c.id
					WHERE pc.product_id = p.id
				),
				'[]'::json
			) AS categories,
			COALESCE(
				(
					SELECT json_agg(t)
					FROM ${productToTag} pt
					LEFT JOIN ${ecTag} t ON pt.tag_id = t.id
					WHERE pt.product_id = p.id
				),
				'[]'::json
			) AS tags,
			COALESCE(
				(
					SELECT json_agg(b)
					FROM ${productToBrand} pb
					LEFT JOIN ${ecBrand} b ON pb.brand_id = b.id
					WHERE pb.product_id = p.id
				),
				'[]'::json
			) AS brands,
			COALESCE(
				(
					SELECT json_agg(
						json_build_object(
							'id', pv.id,
							'product_id', pv.product_id,
							'option_id', pv.option_id,
							'combination', pv.combination,
							'order', pv.order,
							'option', CASE
							 	WHEN po.id IS NOT NULL 
								THEN
									(row_to_json(po.*)::jsonb - 'price' - 'sale_price')
									|| jsonb_build_object('price', po.price::text, 'sale_price', po.sale_price::text)
								ELSE NULL
							END
						) ORDER BY pv.order ASC
					)
					FROM ${productVariant} pv
					LEFT JOIN ${productOption} po ON pv.option_id = po.id
					WHERE pv.product_id = p.id
				),
				'[]'::json
			) AS variants,
			COALESCE(
				(
					SELECT json_agg(
						json_build_object(
							'id', pa.id,
							'attribute_id', pa.attribute_id,
							'name', CASE 
								WHEN pa.attribute_id IS NOT NULL AND a.name IS NOT NULL 
								THEN a.name 
								ELSE pa.name 
							END,
							'value', CASE 
								WHEN pa.attribute_id IS NOT NULL AND a.value IS NOT NULL 
								THEN a.value 
								ELSE pa.value 
							END,
							'order', pa.order,
							'select_type', pa.select_type,
							'visible', pa.visible
						) ORDER BY pa.order ASC
					)
					FROM ${productAttribute} pa
					LEFT JOIN ${ecAttribute} a ON pa.attribute_id = a.id
					WHERE pa.product_id = p.id
				),
				'[]'::json
			) AS attributes

		FROM ${product} p
		LEFT JOIN ${productOption} po ON p.product_option_id = po.id

		LEFT JOIN ${productToTag} ptt ON p.id = ptt.product_id
		LEFT JOIN ${ecTag} et ON ptt.tag_id = et.id

		LEFT JOIN ${productToCategory} ptc ON p.id = ptc.product_id
		LEFT JOIN ${ecCategory} ec ON ptc.category_id = ec.id

		LEFT JOIN ${productToBrand} ptb ON p.id = ptb.product_id
		LEFT JOIN ${ecBrand} eb ON ptb.brand_id = eb.id

		LEFT JOIN ${productAttribute} pta ON p.id = pta.product_id
		LEFT JOIN ${ecAttribute} ea ON pta.attribute_id = ea.id

		WHERE
			p.slug = ${slug}
			AND ${!(preview || edit) ? sql`p.status = ${status}` : sql`TRUE`}
	`)
	console.timeEnd('getProduct')

	const pLength = products.rows.length

	if (pLength === 0) return null

	if (pLength === 1) {
		const p = products.rows[0]

		if (!p.option) {
			console.error(`Product ${p.id} has no productOption`)
			return null
		}

		const product = convertDateFields(
			camelcaseKeys(p, { deep: true, stopPaths: ['variants.combination'] }),
			[
				'createdAt',
				'updatedAt',
				'deletedAt',
				'publishedAt',
				'saleStartsAt',
				'saleEndsAt',
			],
		)

		return {
			...product,
			option: convertPriceStringToBigInt(product.option),
			variants: product.variants.map(variant => ({
				...variant,
				option: convertPriceStringToBigInt(variant.option),
			})),
		}
	}

	// Should never happen since slug is unique
	console.error(`Expected 1 or 0 product, got ${pLength} from slug ${slug}`)
	return null
}

export const getProductGallery = async (productId: number) => {
	const gallery = await dbStore.query.productGallery.findMany({
		where: (gallery, { eq }) => eq(gallery.productId, productId),
	})
	return gallery
}

export type CrossSellProduct = ProductListing &
	Pick<typeof productCrossSell.$inferSelect, 'order'>

export const getCrossSellProducts = async (
	productId: number,
): Promise<CrossSellProduct[]> => {
	const crossSells = await dbStore.execute<CrossSellProduct>(sql`
		SELECT
		DISTINCT ON (p.id)
			p.id,
			p.name,
			p.slug,
			p.status,
			p.updated_at,
			pcs.order,
			CASE
				WHEN po.id IS NOT NULL
				THEN json_build_object(
					'id', po.id,
					'image', po.image,
					'price', po.price::text,
					'sale_price', po.sale_price::text,
					'scale', po.scale,
					'currency', po.currency,
					'sku', po.sku,
					'manage_stock', po.manage_stock,
					'stock_status', po.stock_status
				)
				ELSE NULL
	   		END AS option
		FROM ${productCrossSell} pcs
		LEFT JOIN ${product} p ON p.id = pcs.cross_sell_product_id
		LEFT JOIN ${productOption} po ON p.product_option_id = po.id
		WHERE pcs.product_id = ${productId}
	`)

	const converted = convertDateFields(
		camelcaseKeys(crossSells.rows, { deep: true }),
		['updatedAt'],
	)

	return converted.map(p => ({
		...p,
		option: convertPriceStringToBigInt(p.option),
	}))
}

export type UpsellProduct = ProductListing &
	Pick<typeof productUpsell.$inferSelect, 'order'>

export const getUpsellProducts = async (
	productId: number,
): Promise<UpsellProduct[]> => {
	const upsells = await dbStore.execute<UpsellProduct>(sql`
		SELECT
		DISTINCT ON (p.id)
			p.id,
			p.name,
			p.slug,
			p.status,
			p.updated_at,
			pus.order,
			CASE
				WHEN po.id IS NOT NULL
				THEN json_build_object(
					'id', po.id,
					'image', po.image,
					'price', po.price::text,
					'sale_price', po.sale_price::text,
					'scale', po.scale,
					'currency', po.currency,
					'sku', po.sku,
					'manage_stock', po.manage_stock,
					'stock_status', po.stock_status
				)
				ELSE NULL
	   		END AS option
		FROM ${productUpsell} pus
		LEFT JOIN ${product} p ON p.id = pus.upsell_product_id
		LEFT JOIN ${productOption} po ON p.product_option_id = po.id
		WHERE pus.product_id = ${productId}
	`)

	const converted = convertDateFields(
		camelcaseKeys(upsells.rows, { deep: true }),
		['updatedAt'],
	)

	return converted.map(p => ({
		...p,
		option: convertPriceStringToBigInt(p.option),
	}))
}

// ==============================
// Create / Update / Delete
// ==============================

export type UpdateCrossSellProductsParams = {
	productId: number
	values: Pick<
		typeof productCrossSell.$inferInsert,
		'crossSellProductId' | 'order'
	>[]
}
export const updateCrossSellProducts = async ({
	productId,
	values,
}: UpdateCrossSellProductsParams) => {
	await dbStore.transaction(async tx => {
		// Delete existing associations
		await tx
			.delete(productCrossSell)
			.where(eq(productCrossSell.productId, productId))

		// Insert new associations (including order)
		if (values.length > 0) {
			await tx
				.insert(productCrossSell)
				.values(values.map(v => ({ ...v, productId })))
		}
	})
}

export type UpdateUpsellProductsParams = {
	productId: number
	values: Pick<typeof productUpsell.$inferInsert, 'upsellProductId' | 'order'>[]
}
export const updateUpsellProducts = async ({
	productId,
	values,
}: UpdateUpsellProductsParams) => {
	await dbStore.transaction(async tx => {
		// Delete existing associations
		await tx.delete(productUpsell).where(eq(productUpsell.productId, productId))

		// Insert new associations (including order)
		if (values.length > 0) {
			await tx
				.insert(productUpsell)
				.values(values.map(v => ({ ...v, productId })))
		}
	})
}

// ===== Helper Functions =====

/**
 * 	1. categories: Category[]
 *	2. tags: Tag[]
 *	3. brands: Brand[]
 *	4. variants: ProductVariant[]
 *	5. attributes: ProductAttribute[]
 */

/** Update product categories - replace all associations */
async function updateProductCategories(
	tx: TransactionType,
	productId: number,
	categories: Category[],
) {
	// Delete existing associations
	await tx
		.delete(productToCategory)
		.where(eq(productToCategory.productId, productId))

	// Insert new associations
	if (categories.length > 0) {
		await tx.insert(productToCategory).values(
			categories.map((cat, index) => ({
				productId,
				categoryId: cat.id,
				order: index,
			})),
		)
	}
}

/** Update product tags - replace all associations */
async function updateProductTags(
	tx: TransactionType,
	productId: number,
	tags: Tag[],
) {
	// Delete existing associations
	await tx.delete(productToTag).where(eq(productToTag.productId, productId))

	// Insert new associations
	if (tags.length > 0) {
		await tx.insert(productToTag).values(
			tags.map((tag, index) => ({
				productId,
				tagId: tag.id,
				order: index,
			})),
		)
	}
}

/** Update product brands - replace all associations */
async function updateProductBrands(
	tx: TransactionType,
	productId: number,
	brands: Brand[],
) {
	// Delete existing associations
	await tx.delete(productToBrand).where(eq(productToBrand.productId, productId))

	// Insert new associations
	if (brands.length > 0) {
		await tx.insert(productToBrand).values(
			brands.map((brand, index) => ({
				productId,
				brandId: brand.id,
				order: index,
			})),
		)
	}
}

/** Update product variants - replace all variants and their options */
async function updateProductVariants(
	tx: TransactionType,
	productId: number,
	variants: ProductVariant[],
) {
	const existingVariants = await tx.query.productVariant.findMany({
		where: eq(productVariant.productId, productId),
	})

	// Collect option IDs to delete (those not being reused)
	const existingOptionIds = existingVariants.map(v => v.optionId)
	const optionIdsInUse = variants
		.map(v => v.option.id)
		.filter(id => existingOptionIds.includes(id))
	const optionIdsToDelete = existingOptionIds.filter(
		id => !optionIdsInUse.includes(id),
	)

	// Delete orphaned options
	if (optionIdsToDelete.length > 0) {
		await tx
			.delete(productOption)
			.where(inArray(productOption.id, optionIdsToDelete))
	}

	// Insert new variants
	if (variants.length > 0) {
		const variantsToInsert = await Promise.all(
			variants.map(async variant => {
				let optionIdDatabase: number
				const [{ id: optionId }] = await tx
					.select({ id: productOption.id })
					.from(productOption)
					.where(eq(productOption.id, variant.option.id))

				if (!optionId) {
					const [{ id: newOptionId }] = await tx
						.insert(productOption)
						.values(variant.option)
						.returning({
							id: productOption.id,
						})
					optionIdDatabase = newOptionId
				} else {
					await tx
						.update(productOption)
						.set(variant.option)
						.where(eq(productOption.id, optionId))
					optionIdDatabase = optionId
				}

				const { combination, order } = variant
				return { combination, order, optionId: optionIdDatabase, productId }
			}),
		)

		// Insert variants at once
		await tx.insert(productVariant).values(variantsToInsert)
	}
}

/** Update product attributes - replace all */
async function updateProductAttributes(
	tx: TransactionType,
	productId: number,
	attributes: ProductAttribute[],
) {
	// Delete existing attributes
	await tx
		.delete(productAttribute)
		.where(eq(productAttribute.productId, productId))

	// Insert new attributes
	if (attributes.length > 0) {
		await tx.insert(productAttribute).values(
			attributes.map(
				attr =>
					({
						productId,
						name: attr.name,
						value: attr.value,
						attributeId: attr.attributeId,
						order: attr.order,
						selectType: attr.selectType,
						visible: attr.visible,
					}) satisfies typeof productAttribute.$inferInsert,
			),
		)
	}
}

/** Delete a product (soft delete by default, or hard delete) */
export async function deleteProduct(productId: number, hardDelete = false) {
	if (hardDelete) {
		await dbStore.transaction(async tx => {
			// Get product to find its default option
			const [p] = await tx
				.select({
					productOptionId: product.productOptionId,
					seoId: product.seoId,
				})
				.from(product)
				.where(eq(product.id, productId))

			if (!p) {
				throw new Error(`ProductId ${productId} not found`)
			}

			await tx.delete(product).where(eq(product.id, productId)).returning({
				name: product.name,
			})
			await tx.delete(seo).where(eq(seo.id, p.seoId))
		})
	} else {
		// Soft delete
		await dbStore
			.update(product)
			.set({ deletedAt: new Date() })
			.where(eq(product.id, productId))
			.returning({ name: product.name })
	}
}
