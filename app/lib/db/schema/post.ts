import { relations, type InferSelectModel } from 'drizzle-orm'
import { serial, text, varchar } from 'drizzle-orm/pg-core'

import { user } from './auth'
import { pgTable, timestampAttributes } from './helpers'
import { seo } from './seo'
import { postToCategory, postToTag } from './taxonomy'

export const PostStatus = [
	'DRAFT',
	'PUBLISHED',
	'ARCHIVED',
	'TRASHED',
	'POLICY',
] as const
export type PostStatus = (typeof PostStatus)[number]

export type Post = InferSelectModel<typeof post>

export const post = pgTable('post', {
	id: serial('id').primaryKey(),
	slug: varchar('slug').notNull().unique(),
	title: varchar('title').notNull(),
	content: text('content'),
	excerpt: varchar('excerpt'),
	featuredImage: varchar('featured_image'),
	status: varchar('status', { length: 50 }).notNull(),

	authorId: text('author_id').references(() => user.id, {
		onDelete: 'set null',
	}),

	...timestampAttributes,
})

export const postRelations = relations(post, ({ one, many }) => ({
	author: one(user, {
		fields: [post.authorId],
		references: [user.id],
	}),
	seo: one(seo, {
		fields: [post.id],
		references: [seo.postId],
	}),

	postToTag: many(postToTag),
	postToCategory: many(postToCategory),
}))
