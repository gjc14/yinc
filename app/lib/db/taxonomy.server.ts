/**
 * TODO: Add description and slug
 */
import { eq } from 'drizzle-orm'

import { db } from '~/lib/db/db.server'

import { generateSlug } from '../utils/seo'
import type { Category, SubCategory, Tag } from './schema'
import { categoriesTable, subCategoriesTable, tagsTable } from './schema'

/**
 * Tag and Category functions
 */
export const createCategory = async ({
	name,
	description = '',
}: {
	name: string
	description?: string
}): Promise<{ category: Category }> => {
	let slug = generateSlug(name)
	if (!slug) {
		slug = generateSlug(String(Date.now()))
	}

	const [category] = await db
		.insert(categoriesTable)
		.values({ name, slug, description })
		.returning()
	return { category }
}

export const getCategories = async (): Promise<{
	categories: (Category & { subCategories: SubCategory[] })[]
}> => {
	const categories = await db.query.categoriesTable.findMany({
		with: { subCategories: true },
		orderBy: (table, { asc }) => {
			return asc(table.id)
		},
	})
	return { categories }
}

export const deleteCategory = async (
	id: number,
): Promise<{ category: Category }> => {
	const [category] = await db
		.delete(categoriesTable)
		.where(eq(categoriesTable.id, id))
		.returning()
	return { category }
}

// Subcategory functions
export const createSubcategory = async ({
	categoryId,
	name,
	description = '',
}: {
	categoryId: number
	name: string
	description?: string
}): Promise<{ subcategory: SubCategory }> => {
	let slug = generateSlug(name)
	if (!slug) {
		slug = generateSlug(String(Date.now()))
	}

	const [subcategory] = await db
		.insert(subCategoriesTable)
		.values({ name, categoryId, slug, description })
		.returning()
	return { subcategory }
}

export const getSubcategories = async (): Promise<{
	subcategories: SubCategory[]
}> => {
	const subcategories = await db.query.subCategoriesTable.findMany({
		orderBy: (table, { asc }) => {
			return asc(table.id)
		},
	})
	return { subcategories }
}

export const deleteSubcategory = async (
	id: number,
): Promise<{ subcategory: SubCategory }> => {
	const [subcategory] = await db
		.delete(subCategoriesTable)
		.where(eq(subCategoriesTable.id, id))
		.returning()
	return { subcategory }
}

// Tag functions
export const createTag = async ({
	name,
	description = '',
}: {
	name: string
	description?: string
}): Promise<{ tag: Tag }> => {
	let slug = generateSlug(name)
	if (!slug) {
		slug = generateSlug(String(Date.now()))
	}

	const [tag] = await db
		.insert(tagsTable)
		.values({ name, slug, description })
		.returning()
	return { tag }
}

export const getTags = async (): Promise<{ tags: Tag[] }> => {
	const tags = await db.query.tagsTable.findMany({
		orderBy: (table, { asc }) => {
			return asc(table.id)
		},
	})
	return { tags }
}

export const deleteTag = async (id: number): Promise<{ tag: Tag }> => {
	const [tag] = await db
		.delete(tagsTable)
		.where(eq(tagsTable.id, id))
		.returning()
	return { tag }
}
