import { ActionFunctionArgs } from '@remix-run/node'

import { getToken, sendMagicLink } from '~/lib/db/auth.server'
import { createUser } from '~/lib/db/user.server'
import { ConventionalActionResponse } from '~/lib/utils'

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return Response.json({
            err: 'Method not allowed',
        } satisfies ConventionalActionResponse)
    }

    const formData = await request.formData()
    const email = formData.get('email')

    if (!email || typeof email !== 'string') {
        return Response.json({
            err: 'Invalid email',
        } satisfies ConventionalActionResponse)
    }

    try {
        const { user } = await createUser(email, 'ADMIN', 'INACTIVE')

        const token = await getToken(user.id, user.email)
        await sendMagicLink(token, user.email, new URL(request.url).origin, {
            searchParams: { role: user.role },
        })

        return Response.json({
            msg: `Success invite ${email}`,
        } satisfies ConventionalActionResponse)
    } catch (error) {
        // TODO: Handle user existing error
        console.error('Error creating user:', error)
        return Response.json({
            err: 'Failed to invite',
        } satisfies ConventionalActionResponse)
    }
}
