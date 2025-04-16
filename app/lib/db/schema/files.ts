import { relations, type InferSelectModel } from 'drizzle-orm'
import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core'

import { user } from './auth'

export type FileMetadata = InferSelectModel<typeof filesTable>

export const filesTable = pgTable(
	'files',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
		key: varchar('key', { length: 255 }).unique().notNull(),
		type: varchar('type', { length: 100 }).notNull(),
		size: integer('size').notNull(),
		name: varchar('name', { length: 255 }).notNull(),
		description: varchar('description', { length: 255 }),
		star: integer('star').default(0),
		garbage: integer('garbage').default(0),

		ownerId: text('owner_id').references(() => user.id, {
			onDelete: 'set null',
		}),
		public: integer('public').default(0),
	},
	t => [
		index('files_owner_id_idx').on(t.ownerId),
		index('files_key_idx').on(t.key),
	],
)

export const filesRelations = relations(filesTable, ({ one }) => ({
	user: one(user, {
		fields: [filesTable.ownerId],
		references: [user.id],
	}),
}))
