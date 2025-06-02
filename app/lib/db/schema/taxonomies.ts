import { relations, sql, type InferSelectModel } from 'drizzle-orm'
import {
	check,
	foreignKey,
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

export const categoriesTable = pgTable(
	'categories',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 100 }).notNull(),
		slug: varchar('slug', { length: 100 }).notNull(),
		description: varchar('description', { length: 255 }),
		parentId: integer('parent_id'),
	},
	table => [
		// Prevent self-reference: a category cannot be its own parent
		check('no_self_reference', sql`${table.id} != ${table.parentId}`),
		foreignKey({
			name: 'parent_category_fk',
			columns: [table.parentId],
			foreignColumns: [table.id],
		}).onDelete('cascade'),
	],
)

export const categoriesRelations = relations(
	categoriesTable,
	({ one, many }) => ({
		postsToCategories: many(postsToCategories),
		parent: one(categoriesTable, {
			fields: [categoriesTable.parentId],
			references: [categoriesTable.id],
			relationName: 'parent_child',
		}),
		children: many(categoriesTable, {
			relationName: 'parent_child',
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
