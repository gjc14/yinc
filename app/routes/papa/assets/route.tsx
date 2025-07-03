/**
 * Proxy requests to the presigned URL of the asset
 */
import { redirect, type LoaderFunctionArgs } from 'react-router'

import { db } from '~/lib/db/db.server'

import { validateAdminSession } from '../auth/utils'
import { presignedUrlRes } from './helpers'

// UUID validation function
const isValidUUID = (str: string): boolean => {
	// RFC 4122 compliant UUID regex (more strict - validates version and variant)
	const strictUuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

	// Less strict UUID regex (accepts any valid hex format) from https://ihateregex.io/expr/uuid/
	// const looseUuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

	return strictUuidRegex.test(str)
}

type Metadata = { key: string; public: number | null; ownerId: string | null }

const metadataCache = new Map<string, Metadata | null>()

// Usage: papa.cloud/assets/{assetId}
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const assetId = params.assetId

	if (!assetId) {
		console.log(`Asset ${assetId} not found`)
		return redirect(
			'/assets/error' + '?status=400' + '&statusText=Invalid arguments',
		)
	}

	// Validate UUID format before database query
	if (!isValidUUID(assetId)) {
		console.log(`Invalid UUID format: ${assetId}`)
		return redirect(
			'/assets/error' + '?status=400' + '&statusText=Invalid arguments',
		)
	}

	let metadata: Metadata | null = null

	console.time(`Fetching asset ${assetId}`)

	// Check if metadata is cached
	if (metadataCache.has(assetId)) {
		console.log(`asset ${assetId} from cache`)
		metadata = metadataCache.get(assetId) || null
	} else {
		console.log(`asset ${assetId} from database`)
		metadata =
			(await db.query.filesTable.findFirst({
				where: (t, { eq, and }) => and(eq(t.id, assetId)),
				columns: {
					key: true,
					public: true,
					ownerId: true,
				},
			})) || null

		// Cache the metadata
		metadataCache.set(assetId, metadata)
	}

	console.timeEnd(`Fetching asset ${assetId}`)

	if (!metadata)
		throw new Response('asset not found', {
			status: 404,
			statusText: 'Asset not found',
		})

	if (!metadata.public) {
		// TODO: check ACL (access control) here
		const session = await validateAdminSession(request)
		if (metadata.ownerId !== session.user.id) {
			throw new Response('', { status: 401 })
		}
	}

	return presignedUrlRes(metadata.key)
}
