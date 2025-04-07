import { createCookie, redirect } from 'react-router'

import { type User } from './schema'
import { getUserById } from './user-old.server'

let COOKIE_SECRET = process.env.COOKIE_SECRET
if (!COOKIE_SECRET) {
    console.warn('COOKIE_SECRET is not set')
    COOKIE_SECRET = 'default-cookie-s3cr3t'
}

export const authCookie = createCookie(
    `auth-${process.env.APP_NAME ?? 'papa'}`,
    {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/', // Available everywhere on the site
        sameSite: 'lax',
        secrets: [COOKIE_SECRET],
        maxAge: 60 * 60 * 24 * 14, // 14 days
    }
)

/**
 * Await this function to check if the user is authenticated with specified roles.
 * When unauthenticated, default to redirect to admin sign in page `/admiin/signin`.
 * @param redirectToSignIn Pass in "" if you do not want to redirect
 */
export function userIs(
    request: Request,
    roles: string[],
    redirectToSignIn?: string
): Promise<{ user: User }>

export function userIs(
    request: Request,
    roles: string[],
    redirectToSignIn: ''
): Promise<{ user: User | null }>

export async function userIs(
    request: Request,
    roles: string[],
    redirectToSignIn: string = '/admin/signin'
): Promise<{ user: User | null }> {
    const cookieString = request.headers.get('Cookie')
    if (!cookieString && redirectToSignIn) throw redirect(redirectToSignIn)

    const cookie = await authCookie.parse(cookieString)
    if (cookie && typeof cookie === 'object' && 'id' in cookie) {
        const { user } = await getUserById(cookie.id)
        if (user && user.status === 'ACTIVE' && roles.includes(user.role)) {
            return { user }
        }
    }

    if (redirectToSignIn) {
        throw redirect(redirectToSignIn)
    } else {
        return { user: null }
    }
}
