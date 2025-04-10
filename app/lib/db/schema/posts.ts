import { relations, type InferSelectModel } from 'drizzle-orm'
import {
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core'

import { user } from './auth'
import { seosTable } from './seos'
import { postsToCategories, postsToTags } from './taxonomies'

export type Post = InferSelectModel<typeof postsTable>

export const postsTable = pgTable('posts', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	slug: varchar('slug').notNull().unique(),
	title: varchar('title').notNull(),
	content: text('content'),
	excerpt: varchar('excerpt'),
	featuredImage: varchar('featured_image'),
	status: varchar('status', { length: 50 }).notNull(),

	authorId: text('author_id').references(() => user.id, {
		onDelete: 'set null',
	}),
})

export const postsRelations = relations(postsTable, ({ one, many }) => ({
	author: one(user, {
		fields: [postsTable.authorId],
		references: [user.id],
	}),
	seo: one(seosTable, {
		fields: [postsTable.id],
		references: [seosTable.postId],
	}),

	postsToTags: many(postsToTags),
	postsToCategories: many(postsToCategories),
}))

export const PostStatus = [
	'DRAFT',
	'PUBLISHED',
	'ARCHIVED',
	'TRASHED',
	'POLICY',
] as const
export type PostStatus = (typeof PostStatus)[number]
export const PostStatusEnum = pgEnum('post_status', PostStatus)
