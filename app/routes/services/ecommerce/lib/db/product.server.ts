import camelcaseKeys from 'camelcase-keys'
import { sql } from 'drizzle-orm'

import { convertDateFields } from '~/lib/db/utils'

import { dbStore } from './db.server'
import {
	product,
	productOption,
	productToBrand,
	productToCategory,
	productToTag,
	type ProductStatus,
} from './schema/product'
import { ecBrand, ecCategory, ecTag } from './schema/taxonomy'

type Product = typeof product.$inferSelect
type ProductOption = typeof productOption.$inferSelect

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
		| 'sku'
		| 'manageStock'
		| 'stockStatus'
		// TODO: add stockQuantity if manageStock is 1
	>
}

export type ProductListingWithRelations = ProductListing & {
	categories: (typeof ecCategory.$inferSelect)[]
	tags: (typeof ecTag.$inferSelect)[]
	brands: (typeof ecBrand.$inferSelect)[]
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
					'price', po.price,
					'sale_price', po.sale_price,
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

	return validProducts
}
