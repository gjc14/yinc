import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined')
}

export const dbStore = drizzle(process.env.DATABASE_URL, {
	schema,
	casing: 'snake_case',
})

export type TransactionType = Parameters<
	Parameters<(typeof dbStore)['transaction']>[0]
>[0]
