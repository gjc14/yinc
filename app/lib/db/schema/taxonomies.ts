import { relations, type InferSelectModel } from 'drizzle-orm'
import {
	integer,
	pgTable,
	primaryKey,
	serial,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core'

import { postsTable } from './posts'

export type Tag = InferSelectModel<typeof tagsTable>

export const tagsTable = pgTable('tags', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	description: varchar('description', { length: 255 }),
})

export const tagsRelations = relations(tagsTable, ({ many }) => ({
	postsToTags: many(postsToTags),
}))

export type Category = InferSelectModel<typeof categoriesTable>

export const categoriesTable = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	description: varchar('description', { length: 255 }),
})

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
	postsToCategories: many(postsToCategories),
	subCategories: many(subCategoriesTable),
}))

export type SubCategory = InferSelectModel<typeof subCategoriesTable>

export const subCategoriesTable = pgTable(
	'sub_categories',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 100 }).notNull(),
		slug: varchar('slug', { length: 100 }).notNull(),
		description: varchar('description', { length: 255 }),
		categoryId: integer('category_id')
			.notNull()
			.references(() => categoriesTable.id, { onDelete: 'cascade' }),
	},
	table => [uniqueIndex('sub_category_idx').on(table.name, table.categoryId)],
)

export const subCategoriesRelations = relations(
	subCategoriesTable,
	({ one }) => ({
		category: one(categoriesTable, {
			fields: [subCategoriesTable.categoryId],
			references: [categoriesTable.id],
		}),
	}),
)

// Associative tables

// posts <-> tags

export type PostsToTag = InferSelectModel<typeof postsToTags>

export const postsToTags = pgTable(
	'posts_to_tags',
	{
		postId: integer('post_id')
			.notNull()
			.references(() => postsTable.id, { onDelete: 'cascade' }),
		tagId: integer('tag_id')
			.notNull()
			.references(() => tagsTable.id, { onDelete: 'cascade' }),
	},
	table => [
		primaryKey({ columns: [table.postId, table.tagId] }), // Composite primary key
		uniqueIndex('tag_idx').on(table.postId, table.tagId), // Unique constraint to prevent duplicates
	],
)

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
	post: one(postsTable, {
		fields: [postsToTags.postId],
		references: [postsTable.id],
	}),
	tag: one(tagsTable, {
		fields: [postsToTags.tagId],
		references: [tagsTable.id],
	}),
}))

// posts <-> categories

export type PostsToCategory = InferSelectModel<typeof postsToCategories>

export const postsToCategories = pgTable(
	'posts_to_categories',
	{
		postId: integer('post_id')
			.notNull()
			.references(() => postsTable.id, { onDelete: 'cascade' }),
		categoryId: integer('category_id')
			.notNull()
			.references(() => categoriesTable.id, { onDelete: 'cascade' }),
	},
	table => [
		primaryKey({ columns: [table.postId, table.categoryId] }), // Composite primary key
		uniqueIndex('category_idx').on(table.postId, table.categoryId), // Unique constraint
	],
)

export const postsToCategoriesRelations = relations(
	postsToCategories,
	({ one }) => ({
		post: one(postsTable, {
			fields: [postsToCategories.postId],
			references: [postsTable.id],
		}),
		category: one(categoriesTable, {
			fields: [postsToCategories.categoryId],
			references: [categoriesTable.id],
		}),
	}),
)
