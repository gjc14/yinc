import { asc, desc, eq, gt, InferInsertModel, lt } from 'drizzle-orm'

import { User, UserRole, usersTable, UserStatus } from '~/lib/db/schema'
import { db } from './db.server'

/**
 * Get users by cursor-based pagination
 * @param cursor the last record id of the previous page
 * @param pageSize number of records to fetch
 * @param direction direction of the pagination
 */
export const getUsers = async (
    cursor: number = 0,
    pageSize: number = 10,
    direction: 'next' | 'previous' = 'next'
): Promise<{
    users: User[]
    nextCursor: number | null
    prevCursor: number | null
}> => {
    const buildQuery = () => {
        const baseQuery = db
            .select()
            .from(usersTable)
            .limit(pageSize + 1) // Get one more to check if there is more data

        if (cursor) {
            if (direction === 'next') {
                return baseQuery
                    .where(lt(usersTable.id, cursor))
                    .orderBy(desc(usersTable.id))
            } else {
                return baseQuery
                    .where(gt(usersTable.id, cursor))
                    .orderBy(asc(usersTable.id))
            }
        } else {
            // Start from the beginning
            return baseQuery.orderBy(desc(usersTable.id))
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
    email: string
): Promise<{ user: User | null }> => {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
    return { user }
}

export const getUserById = async (
    id: number
): Promise<{ user: User | null }> => {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
    return { user }
}

export const createUser = async (
    email: string,
    role: UserRole,
    status: UserStatus
): Promise<{ user: User }> => {
    const [user] = await db
        .insert(usersTable)
        .values([
            {
                email,
                role,
                status,
            },
        ])
        .returning()
    return { user }
}

export const updateUser = async (props: {
    id: number
    data: Partial<Omit<InferInsertModel<typeof usersTable>, 'id'>>
}): Promise<{ user: User }> => {
    const [user] = await db
        .update(usersTable)
        .set(props.data)
        .where(eq(usersTable.id, props.id))
        .returning()
    return { user }
}

export const deleteUser = async (id: number): Promise<{ user: User }> => {
    const [user] = await db
        .delete(usersTable)
        .where(eq(usersTable.id, id))
        .returning()
    return { user }
}
