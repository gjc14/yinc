import { relations, sql, type InferSelectModel } from 'drizzle-orm'
import {
	check,
	foreignKey,
	integer,
	primaryKey,
	serial,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core'

import { pgTable } from './helpers'
import { post } from './post'

export type Tag = InferSelectModel<typeof tag>

export const tag = pgTable('tag', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	description: varchar('description', { length: 255 }),
})

export const tagsRelations = relations(tag, ({ many }) => ({
	postToTag: many(postToTag),
}))

export type Category = InferSelectModel<typeof category>

export const category = pgTable(
	'category',
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

export const categoriesRelations = relations(category, ({ one, many }) => ({
	postToCategory: many(postToCategory),
	parent: one(category, {
		fields: [category.parentId],
		references: [category.id],
		relationName: 'parent_child',
	}),
	children: many(category, {
		relationName: 'parent_child',
	}),
}))

// Associative tables

// posts <-> tags

export type PostsToTag = InferSelectModel<typeof postToTag>

export const postToTag = pgTable(
	'post_to_tag',
	{
		postId: integer('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		tagId: integer('tag_id')
			.notNull()
			.references(() => tag.id, { onDelete: 'cascade' }),
	},
	table => [
		primaryKey({ columns: [table.postId, table.tagId] }), // Composite primary key
		uniqueIndex('tag_idx').on(table.postId, table.tagId), // Unique constraint to prevent duplicates
	],
)

export const postsToTagsRelations = relations(postToTag, ({ one }) => ({
	post: one(post, {
		fields: [postToTag.postId],
		references: [post.id],
	}),
	tag: one(tag, {
		fields: [postToTag.tagId],
		references: [tag.id],
	}),
}))

// posts <-> categories

export type PostsToCategory = InferSelectModel<typeof postToCategory>

export const postToCategory = pgTable(
	'post_to_category',
	{
		postId: integer('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		categoryId: integer('category_id')
			.notNull()
			.references(() => category.id, { onDelete: 'cascade' }),
	},
	table => [
		primaryKey({ columns: [table.postId, table.categoryId] }), // Composite primary key
		uniqueIndex('category_idx').on(table.postId, table.categoryId), // Unique constraint
	],
)

export const postsToCategoriesRelations = relations(
	postToCategory,
	({ one }) => ({
		post: one(post, {
			fields: [postToCategory.postId],
			references: [post.id],
		}),
		category: one(category, {
			fields: [postToCategory.categoryId],
			references: [category.id],
		}),
	}),
)
