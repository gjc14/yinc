import pkg from 'pg'
import { z } from 'zod'

import { type ConventionalActionResponse } from '~/lib/utils'

const { DatabaseError } = pkg

/**
 * @param error passing error from catch when try update database with drizzle and zod
 * @param request MDN Request
 * @returns Response.json
 */
export const handleError = (
	error: unknown,
	request: Request,
	{ errorMessage }: { errorMessage?: string } = {},
) => {
	if (error instanceof z.ZodError) {
		console.error(error.message)
		return Response.json({
			err: 'Internal error: Invalid argument',
		} satisfies ConventionalActionResponse)
	}

	if (error instanceof DatabaseError) {
		console.error(error)
		return Response.json({
			err: error.detail ?? 'Database error',
		} satisfies ConventionalActionResponse)
	}

	if (error instanceof Error) {
		console.error(error.message)
		return Response.json({
			err: error.message,
		} satisfies ConventionalActionResponse)
	}

	console.error(error)
	return Response.json({
		err: errorMessage ?? 'Internal error: Unknown error',
	} satisfies ConventionalActionResponse)
}
