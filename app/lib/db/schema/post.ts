import { relations, sql, type InferSelectModel } from 'drizzle-orm'
import { check, serial, text, varchar } from 'drizzle-orm/pg-core'

import { user } from './auth'
import { pgTable, timestampAttributes } from './helpers'
import { seo } from './seo'
import { postToCategory, postToTag } from './taxonomy'

export const PostStatus = [
	'DRAFT',
	'SCHEDULED',
	'PUBLISHED',
	'ARCHIVED',
	'TRASHED',
	'OTHER',
] as const
export type PostStatus = (typeof PostStatus)[number]

export type Post = InferSelectModel<typeof post>

export const post = pgTable(
	'post',
	{
		id: serial('id').primaryKey(),
		status: varchar('status', { length: 20 }).notNull(),
		slug: varchar('slug').notNull().unique(),
		title: varchar('title').notNull(),
		content: text('content'),
		excerpt: varchar('excerpt'),
		featuredImage: varchar('featured_image'),

		authorId: text('author_id').references(() => user.id, {
			onDelete: 'set null',
		}),

		...timestampAttributes,
	},
	t => [check('prevent_system_slug', sql`${t.slug} != 'new'`)],
)

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
