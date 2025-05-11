import pkg from 'pg'
import { z } from 'zod'

import { type ConventionalActionResponse } from '~/lib/utils'

const { DatabaseError } = pkg

/**
 * @param error passing error from catch when try update database with drizzle and zod
 * @param request MDN Request
 * @returns { err: string } error message
 */
export const handleError = (
	error: unknown,
	request: Request,
	{ errorMessage }: { errorMessage?: string } = {},
) => {
	if (error instanceof z.ZodError) {
		console.error(error.message)
		return {
			err: 'Internal error: Invalid argument',
		} satisfies ConventionalActionResponse
	}

	if (error instanceof DatabaseError) {
		console.error(error)
		return {
			err: error.detail ?? 'Database error',
		} satisfies ConventionalActionResponse
	}

	if (error instanceof Error) {
		console.error(error.message)
		return {
			err: error.message,
		} satisfies ConventionalActionResponse
	}

	console.error(error)
	return {
		err: errorMessage ?? 'Internal error: Unknown error',
	} satisfies ConventionalActionResponse
}
