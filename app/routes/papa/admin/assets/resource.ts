import { type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router'

import { and, eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { deleteFile, getUploadUrl } from '~/lib/db/asset.server'
import { db, S3 } from '~/lib/db/db.server'
import type { FileMetadata } from '~/lib/db/schema'
import { filesTable } from '~/lib/db/schema'
import { type ConventionalActionResponse } from '~/lib/utils'
import { handleError } from '~/lib/utils/server'

import { validateAdminSession } from '../../auth/utils'
import { presignUrlRequestSchema, type PresignResponse } from './schema'

const fileMetadataInsertUpdateSchema = createInsertSchema(filesTable)
	.required({
		id: true,
	})
	.extend({
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
	})

export const action = async ({ request }: ActionFunctionArgs) => {
	if (!S3) {
		return {
			err: 'Object storage not configured',
		} satisfies ConventionalActionResponse
	}

	const adminSession = await validateAdminSession(request)

	const jsonData = await request.json()

	switch (request.method) {
		case 'POST':
			try {
				// Request to generate presigned URLs
				const presignUrlRequests = presignUrlRequestSchema.parse(jsonData)

				// Generate file metadata
				const presignedUrls = await Promise.all(
					presignUrlRequests.map(async file => {
						const presignedUrl = await getUploadUrl({
							key: file.key,
							size: file.size,
							type: file.type,
							checksum: file.checksum,
						})
						return {
							key: file.key,
							presignedUrl,
						}
					}),
				)

				// Store file metadata in DB
				const fileMetadatas = await db
					.insert(filesTable)
					.values(
						presignUrlRequests.map(
							file =>
								({
									key: file.key,
									type: file.type,
									size: file.size,
									name: file.filename,
									ownerId: adminSession.user.id,
								}) satisfies typeof filesTable.$inferInsert,
						),
					)
					.returning()

				const presignedUrlsWithMetadata: PresignResponse = presignedUrls.map(
					url => {
						const fileMetadata = fileMetadatas.find(
							file => file.key === url.key,
						)
						if (!fileMetadata) throw new Error('File metadata not found')
						return {
							metadata: fileMetadata,
							presignedUrl: url.presignedUrl,
						}
					},
				)

				return {
					msg: 'Presign urls generated successfully',
					data: presignedUrlsWithMetadata,
					options: { preventAlert: true },
				} satisfies ConventionalActionResponse
			} catch (error) {
				return handleError(error, request)
			}

		case 'PUT':
			try {
				const fileMetadata = fileMetadataInsertUpdateSchema.parse(jsonData)

				const [newFileMetadata] = await db
					.update(filesTable)
					.set({
						name: fileMetadata.name,
						description: fileMetadata.description,
					})
					.where(eq(filesTable.id, fileMetadata.id))
					.returning()
				return {
					msg: 'File updated',
					data: newFileMetadata,
				} satisfies ConventionalActionResponse
			} catch (error) {
				return handleError(error, request)
			}

		case 'DELETE':
			try {
				if (
					jsonData &&
					typeof jsonData === 'object' &&
					'key' in jsonData &&
					typeof jsonData.key === 'string'
				) {
					const fileMetadata = await db.query.filesTable.findFirst({
						where: (t, { eq }) => eq(t.key, jsonData.key),
					})

					if (!fileMetadata || fileMetadata.ownerId !== adminSession.user.id) {
						console.warn('User is deleting a file that does not belong to them')
						return {
							err: 'File not found',
						} satisfies ConventionalActionResponse
					}

					await deleteFile(jsonData.key)

					await db
						.delete(filesTable)
						.where(
							and(
								eq(filesTable.key, jsonData.key),
								eq(filesTable.ownerId, adminSession.user.id),
							),
						)

					return {
						msg: `File ${fileMetadata.name} deleted successfully`,
					} satisfies ConventionalActionResponse
				} else {
					throw new Error('Invalid argument')
				}
			} catch (error) {
				return handleError(error, request)
			}
		default:
			throw new Response('', { status: 405, statusText: 'Method not allowed' })
	}
}

/**
 * Returns all file metadata belongs to user
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const adminSession = await validateAdminSession(request)

	if (!S3)
		return {
			hasObjectStorage: false,
			files: [] as FileMetadata[],
			origin: request.url,
		}

	const fileMetadata = await db.query.filesTable.findMany({
		where: (t, { eq }) => eq(t.ownerId, adminSession.user.id),
	})

	if (!fileMetadata)
		return {
			hasObjectStorage: true,
			files: [] as FileMetadata[],
			origin: request.url,
		}

	return {
		hasObjectStorage: true,
		files: fileMetadata,
		origin: new URL(request.url).origin,
	}
}
