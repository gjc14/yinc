import { type ActionFunctionArgs } from 'react-router'

import { createUpdateSchema } from 'drizzle-zod'

import { auth } from '~/lib/auth/auth.server'
import { user } from '~/lib/db/schema'
import { deleteUser, updateUser } from '~/lib/db/user.server'
import { isValidEmail, type ConventionalActionResponse } from '~/lib/utils'
import { handleError } from '~/lib/utils/server'

import { validateAdminSession } from '../../auth/utils'

const userUpdateSchema = createUpdateSchema(user).required().omit({
	createdAt: true,
	updatedAt: true,
	banExpires: true,
})

export const action = async ({ request }: ActionFunctionArgs) => {
	if (!['POST', 'PUT', 'DELETE'].includes(request.method)) {
		return {
			err: 'Method not allowed',
		} satisfies ConventionalActionResponse
	}

	const adminSession = await validateAdminSession(request)

	const formData = await request.formData()
	const rawData = Object.fromEntries(formData)

	const userData: Record<string, string | boolean | File> = {}

	for (const [key, value] of Object.entries(rawData)) {
		if (['emailVerified', 'banned'].includes(key)) {
			userData[key] = value === 'true'
		} else {
			userData[key] = value
		}
	}

	switch (request.method) {
		case 'POST':
			try {
				const email = userData.email
				const name = userData.name

				if (
					!email ||
					typeof email !== 'string' ||
					!isValidEmail(email) ||
					typeof name !== 'string'
				) {
					throw new Error('Invalid email')
				}

				const { user } = await auth.api.createUser({
					body: {
						email,
						name: name || email,
						password: '',
						role: 'admin',
					},
				})

				await auth.api.sendVerificationEmail({
					body: {
						email: user.email,
						callbackURL: '/admin',
					},
				})

				return {
					msg: `Admin ${user.email} has created successfully`,
				} satisfies ConventionalActionResponse
			} catch (error) {
				return handleError(error, request)
			}
		case 'PUT':
			try {
				const user = userUpdateSchema.parse(userData)
				const { user: userUpdated } = await updateUser({
					id: user.id,
					data: {
						email: user.email,
						emailVerified: user.emailVerified,
						name: user.name,
						image: user.image,
						role: user.role,
						banReason: user.banReason,
						banned: user.banned,
					},
				})

				return {
					msg: 'Success update ' + (userUpdated.name || userUpdated.email),
				} satisfies ConventionalActionResponse
			} catch (error) {
				return handleError(error, request)
			}
		case 'DELETE':
			const userId = userData.id
			if (typeof userId !== 'string') {
				throw new Error('Invalid argument')
			}

			try {
				const { user } = await deleteUser(userId)
				return {
					msg: `${user.email} deleted successfully`,
				} satisfies ConventionalActionResponse
			} catch (error) {
				return handleError(error, request)
			}
	}
}
