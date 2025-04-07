import { type ActionFunctionArgs } from 'react-router'

import { createUpdateSchema } from 'drizzle-zod'
import { userIs } from '~/lib/db/auth.server'
import { usersTable } from '~/lib/db/schema'
import { createUser, deleteUser, updateUser } from '~/lib/db/user-old.server'
import { type ConventionalActionResponse, isValidEmail } from '~/lib/utils'
import { handleError } from '~/lib/utils/server'

const userUpdateSchema = createUpdateSchema(usersTable).required().omit({
    createdAt: true,
    updatedAt: true,
})

export const action = async ({ request }: ActionFunctionArgs) => {
    if (!['POST', 'PUT', 'DELETE'].includes(request.method)) {
        return Response.json({
            err: 'Method not allowed',
        } satisfies ConventionalActionResponse)
    }

    await userIs(request, ['ADMIN'])

    const formData = await request.formData()
    const userData = Object.fromEntries(formData)

    switch (request.method) {
        case 'POST':
            try {
                const email = userData.email

                if (
                    !email ||
                    typeof email !== 'string' ||
                    !isValidEmail(email)
                ) {
                    throw new Error('Invalid email')
                }

                const { user } = await createUser(email, 'SUBSCRIBER', 'ACTIVE')

                return Response.json({
                    msg: `A subscriber added: ${user.email}`,
                } satisfies ConventionalActionResponse)
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
                        name: user.name,
                        role: user.role,
                        status: user.status,
                    },
                })

                return Response.json({
                    msg:
                        'Success update ' +
                        (userUpdated.name || userUpdated.email),
                } satisfies ConventionalActionResponse)
            } catch (error) {
                return handleError(error, request)
            }
        case 'DELETE':
            const userId = userData.id
            if (Number.isNaN(Number(userId))) {
                throw new Error('Invalid argument')
            }

            try {
                const { user } = await deleteUser(Number(userId))
                return Response.json({
                    msg: `${user.email} deleted successfully`,
                } satisfies ConventionalActionResponse)
            } catch (error) {
                return handleError(error, request)
            }
    }
}
