import { timestamp } from 'drizzle-orm/pg-core'

export const timestampAttribute = {
	timestamp: timestamp().notNull().defaultNow(),
}

export const createdAtAttribute = {
	createdAt: timestamp('created_at').notNull().defaultNow(),
}

export const updatedAtAttribute = {
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
}

export const deletedAtAttribute = {
	deletedAt: timestamp('deleted_at'),
}

export const timestampAttributes = {
	...createdAtAttribute,
	...updatedAtAttribute,
}
