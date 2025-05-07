/**
 * Proxy requests to the presigned URL of the asset
 */
import { redirect, type LoaderFunctionArgs } from 'react-router'

import { db } from '~/lib/db/db.server'

import { validateAdminSession } from '../auth/utils'
import { presignedUrlRes } from './helpers'

// Usage: papa.cloud/assets/{assetId}
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const assetId = params.assetId

	if (!assetId) {
		console.log(`Asset ${assetId} not found`)
		return redirect(
			'/assets/error' + '?status=400' + '&statusText=Invalid parameters',
		)
	}

	const metadata = await db.query.filesTable.findFirst({
		where: (t, { eq, and }) => and(eq(t.id, assetId)),
	})

	if (!metadata) throw new Response('Not Found', { status: 404 })

	if (!metadata.public) {
		// check ACL (access control) here
		const session = await validateAdminSession(request)
		if (metadata.ownerId !== session.user.id) {
			throw new Response('Unauthorized', { status: 403 })
		}
	}

	return presignedUrlRes(metadata.key)
}
