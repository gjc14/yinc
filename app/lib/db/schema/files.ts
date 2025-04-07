import { type InferSelectModel, relations } from 'drizzle-orm'
import {
    integer,
    pgTable,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core'
import { usersTable } from './users-old'

export type File = InferSelectModel<typeof filesTable>

export const filesTable = pgTable('files', {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    key: varchar('key', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    type: varchar('type', { length: 100 }).notNull(),
    size: integer('size').notNull(),
    userId: integer('user_id').references(() => usersTable.id, {
        onDelete: 'set null',
    }),
})

export const filesRelations = relations(filesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [filesTable.userId],
        references: [usersTable.id],
    }),
}))
