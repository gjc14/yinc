import { type InferSelectModel, relations } from 'drizzle-orm'
import {
    pgEnum,
    pgTable,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core'
import { filesTable } from './files'
import { postsTable } from './posts'

export type User = InferSelectModel<typeof usersTable>

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }),
    imageUri: varchar('image_uri', { length: 255 }),
    role: varchar('role', { length: 50 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(),
})

export const usersRelations = relations(usersTable, ({ many }) => ({
    posts: many(postsTable),
    files: many(filesTable),
}))

export const UserRole = ['ADMIN', 'AUTHOR', 'EDITOR', 'SUBSCRIBER'] as const
export type UserRole = (typeof UserRole)[number]
export const UserRoleEnum = pgEnum('user_role', UserRole)

export const UserStatus = ['ACTIVE', 'INACTIVE'] as const
export type UserStatus = (typeof UserStatus)[number]
export const UserStatusEnum = pgEnum('user_status', UserStatus)
