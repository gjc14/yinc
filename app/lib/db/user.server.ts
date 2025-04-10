import { asc, desc, eq, gt, lt } from 'drizzle-orm'

import { user as userTable } from '~/lib/db/schema'

import { db } from './db.server'

type User = typeof userTable.$inferSelect

/**
 * Get users by cursor-based pagination
 * @param cursor the last record id of the previous page
 * @param pageSize number of records to fetch
 * @param direction direction of the pagination
 */
export const getUsers = async (
	cursor: string = '',
	pageSize: number = 10,
	direction: 'next' | 'previous' = 'next',
): Promise<{
	users: User[]
	nextCursor: string | null
	prevCursor: string | null
}> => {
	const buildQuery = () => {
		const baseQuery = db
			.select()
			.from(userTable)
			.limit(pageSize + 1) // Get one more to check if there is more data

		if (cursor) {
			if (direction === 'next') {
				return baseQuery
					.where(lt(userTable.id, cursor))
					.orderBy(desc(userTable.id))
			} else {
				return baseQuery
					.where(gt(userTable.id, cursor))
					.orderBy(asc(userTable.id))
			}
		} else {
			// Start from the beginning
			return baseQuery.orderBy(desc(userTable.id))
		}
	}

	const users = await buildQuery()

	const hasMore = users.length > pageSize
	if (hasMore) {
		// Remove the extra post added in .limit
		users.pop()
	}

	if (direction === 'previous') {
		users.reverse()
	}

	// Calculate next and previous cursors
	const nextCursor = users.length > 0 ? users[users.length - 1].id : null
	const prevCursor = users.length > 0 ? users[0].id : null

	return {
		users,
		nextCursor: hasMore ? nextCursor : null,
		prevCursor: cursor ? prevCursor : null,
	}
}

export const getUser = async (
	email: string,
): Promise<{ user: User | null }> => {
	const [user] = await db
		.select()
		.from(userTable)
		.where(eq(userTable.email, email))
	return { user }
}

export const getUserById = async (
	id: string,
): Promise<{ user: User | null }> => {
	const [user] = await db.select().from(userTable).where(eq(userTable.id, id))
	return { user }
}

export const updateUser = async (props: {
	id: string
	data: Partial<
		Omit<typeof userTable.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>
	>
}): Promise<{ user: User }> => {
	const [user] = await db
		.update(userTable)
		.set(props.data)
		.where(eq(userTable.id, props.id))
		.returning()
	return { user }
}

export const deleteUser = async (id: string): Promise<{ user: User }> => {
	const [user] = await db
		.delete(userTable)
		.where(eq(userTable.id, id))
		.returning()
	return { user }
}
