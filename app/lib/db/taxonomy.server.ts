/**
 * TODO: Add description and slug
 */
import { eq } from 'drizzle-orm'

import { db } from '~/lib/db/db.server'

import { generateSlug } from '../utils/seo'
import type { Category, Tag } from './schema'
import { categoriesTable, tagsTable } from './schema'

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
	const slug = generateSlug(name, { fallbackPrefix: 'category' })

	const [category] = await db
		.insert(categoriesTable)
		.values({ name, slug, description })
		.returning()
	return { category }
}

export const getCategories = async (): Promise<{
	categories: (Category & { children: Category[] })[]
}> => {
	const categories = await db.query.categoriesTable.findMany({
		with: { children: true },
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

// Create a child category
export const createChildCategory = async ({
	parentId,
	name,
	description = '',
}: {
	parentId: number
	name: string
	description?: string
}): Promise<{ category: Category }> => {
	const slug = generateSlug(name, { fallbackPrefix: 'child-category' })

	const [category] = await db
		.insert(categoriesTable)
		.values({ name, slug, description, parentId })
		.returning()
	return { category }
}

// Get all categories with their hierarchical structure
export const getCategoriesHierarchy = async (): Promise<{
	categories: Category[]
}> => {
	const categories = await db.query.categoriesTable.findMany({
		orderBy: (table, { asc }) => {
			return asc(table.id)
		},
	})
	return { categories }
}

// Tag functions
export const createTag = async ({
	name,
	description = '',
}: {
	name: string
	description?: string
}): Promise<{ tag: Tag }> => {
	const slug = generateSlug(name, { fallbackPrefix: 'tag' })

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
