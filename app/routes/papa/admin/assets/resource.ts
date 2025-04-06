import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { LoaderFunctionArgs } from '@remix-run/node'

import { db, S3 } from '~/lib/db/db.server'
import { FileMeta } from '../api/object-storage/schema'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    if (!S3) return { hasObjectStorage: false, files: [] as FileMeta[] }

    const url = new URL(request.url)

    const objects = await S3.send(new ListObjectsV2Command({ Bucket: 'papa' }))
    if (!objects || !objects.Contents)
        return { hasObjectStorage: true, files: [] as FileMeta[] }

    const { Contents } = objects

    const files = await Promise.all(
        Contents.map(async ({ Key, ETag, StorageClass }) => {
            if (!Key) return null
            const fileMetadata = await db.query.filesTable.findFirst({
                where: (t, { eq }) => eq(t.key, Key),
            })
            if (!fileMetadata) return null
            return {
                ...fileMetadata,
                url: url.origin + `/assets/private?key=${Key}`,
                eTag: ETag,
                storageClass: StorageClass,
            }
        })
    )

    const filteredFiles = files.filter(file => file !== null)

    return {
        hasObjectStorage: true,
        files: filteredFiles,
    }
}
