import { redirect } from 'react-router'
import { authCookie } from '~/lib/db/auth.server'

export const action = async () => {
    return redirect('/', {
        headers: {
            'Set-Cookie': await authCookie.serialize('', {
                maxAge: 0,
            }),
        },
    })
}
