/**
 * Proxy requests to the presigned URL of the asset
 */
import { type LoaderFunctionArgs, redirect } from 'react-router'
import { auth } from '~/lib/auth/auth.server'
import { getFileUrl } from '~/lib/db/asset.server'

// Usage: papacms.com/assets/my-file-key?visibility=public
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { searchParams } = new URL(request.url)

    const visibility = params.visibility
    const key = searchParams.get('key')

    if (!key || !visibility) {
        console.log('Key or visibility not found', key, visibility)
        return redirect(
            '/assets/error' + '?status=400' + '&statusText=Invalid parameters'
        )
    }

    if (visibility !== 'public') {
        // TODO: provide allowed roles
        const session = await auth.api.getSession(request)
        const isAdmin = session?.user.role === 'admin'

        if (!isAdmin)
            return redirect(
                '/assets/error' + '?status=404' + '&statusText=File not found'
            )
    }

    const presignedUrl = await getFileUrl(key)

    if (!presignedUrl) {
        return redirect(
            '/assets/error' +
                '?status=500' +
                '&statusText=Error when getting presigned URL'
        )
    }

    const response = await fetch(presignedUrl)
    if (response.status !== 200) {
        console.error(response.status, response.statusText)

        return redirect(
            '/assets/error' +
                `?status=${response.status}` +
                `&statusText=${response.statusText}`
        )
    }

    // Proxy the request to the presigned URL
    return response
}
