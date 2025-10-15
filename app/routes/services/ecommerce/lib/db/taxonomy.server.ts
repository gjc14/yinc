import type { InferInsertModel } from 'drizzle-orm'

import { dbStore } from './db.server'
import * as schema from './schema'

export const createEcTag = async (
	props: InferInsertModel<typeof schema.ecTag>,
) => {
	const [tag] = await dbStore.insert(schema.ecTag).values(props).returning()
	return tag
}

export const getEcTags = async () => {
	const tags = await dbStore.query.ecTag.findMany()

	return tags
}

export const createEcCategory = async (
	props: InferInsertModel<typeof schema.ecCategory>,
) => {
	const [category] = await dbStore
		.insert(schema.ecCategory)
		.values(props)
		.returning()
	return category
}

export const getEcCategories = async () => {
	const categories = await dbStore.query.ecCategory.findMany()

	return categories
}

export const createEcBrand = async (
	props: InferInsertModel<typeof schema.ecBrand>,
) => {
	const [brand] = await dbStore.insert(schema.ecBrand).values(props).returning()
	return brand
}

export const getEcBrands = async () => {
	const brands = await dbStore.query.ecBrand.findMany()

	return brands
}

export const createEcAttribute = async (
	props: InferInsertModel<typeof schema.ecAttribute>,
) => {
	const [attribute] = await dbStore
		.insert(schema.ecAttribute)
		.values(props)
		.returning()
	return attribute
}

export const getEcAttributes = async () => {
	const attributes = await dbStore.query.ecAttribute.findMany()

	return attributes
}
