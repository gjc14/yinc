import { type ActionFunctionArgs } from 'react-router'
import { useLoaderData, useSubmit } from 'react-router'
import { useEffect, useState } from 'react'

import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { db } from '~/lib/db/db.server'
import { capitalize, type ConventionalActionResponse } from '~/lib/utils'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'
import { FileMetaSchema } from '../api/object-storage/schema'
import { FileGrid } from './components/file-grid'

const displayOptions = ['all', 'image', 'video', 'audio', 'file'] as const

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    const formData = await request.formData()
    const newFileMetaString = formData.get('newFileMeta')

    if (!newFileMetaString || typeof newFileMetaString !== 'string') {
        return new Response('Invalid file metadata', { status: 400 })
    }

    const {
        success,
        data: newFileMetaData,
        error,
    } = FileMetaSchema.safeParse(JSON.parse(newFileMetaString))
    if (!success) {
        return Response.json({
            err: 'Invalid file metadata',
        } satisfies ConventionalActionResponse)
    }

    try {
        const [newFile] = await db
            .update(filesTable)
            .set({
                name: newFileMetaData.name,
                description: newFileMetaData.description,
            })
            .where(
                and(
                    eq(filesTable.id, newFileMetaData.id),
                    eq(filesTable.key, newFileMetaData.key)
                )
            )
            .returning()
        return Response.json({
            msg: 'File updated',
            data: newFileMetaData,
        } satisfies ConventionalActionResponse)
    } catch (error) {
        console.log('Error updating file', error)
        return Response.json({
            err: 'Failed to update file',
        } satisfies ConventionalActionResponse)
    }
}

import { and, eq } from 'drizzle-orm'
import { CloudAlert } from 'lucide-react'
import { filesTable } from '~/lib/db/schema'
import { loader } from './resource'
export { loader } from './resource'

export default function AdminAsset() {
    const submit = useSubmit()
    const { hasObjectStorage, files } = useLoaderData<typeof loader>()
    const [filesState, setFilesState] = useState(files)
    const [display, setDisplay] = useState('all')

    const filesDisplayed = filesState.filter(file => {
        if (display === 'all') return true
        if (display === 'file') {
            const fileGeneralType = file.type.split('/')[0]
            return !['image', 'video', 'audio'].includes(fileGeneralType)
        }
        const fileGeneralType = file.type.split('/')[0]
        return fileGeneralType === display
    })

    useEffect(() => {
        setFilesState(files)
    }, [files])

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle
                    title="Assets"
                    description="Manage all your assets on Papa platform"
                ></AdminTitle>
                <AdminActions>
                    <Label htmlFor="asset-filter">Filter by</Label>
                    <Select
                        defaultValue="all"
                        onValueChange={v => {
                            setDisplay(v)
                        }}
                    >
                        <SelectTrigger id="asset-filter" className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {displayOptions.map(option => (
                                <SelectItem key={option} value={option}>
                                    {capitalize(option)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </AdminActions>
            </AdminHeader>
            {hasObjectStorage ? (
                <FileGrid
                    files={filesDisplayed}
                    onFileUpdate={fileMeta => {
                        setFilesState(
                            filesState.map(file =>
                                file.id === fileMeta.id ? fileMeta : file
                            )
                        )
                        submit(
                            { newFileMeta: JSON.stringify(fileMeta) },
                            {
                                method: 'POST',
                                navigate: false,
                            }
                        )
                    }}
                />
            ) : (
                <div className="border rounded-xl w-full h-full min-h-60 grow flex flex-col items-center justify-center gap-3">
                    <CloudAlert size={50} />
                    <p className="text-center text-pretty max-w-sm">
                        Please setup your S3 Object Storage to start uploading
                        assets
                    </p>
                </div>
            )}
        </AdminSectionWrapper>
    )
}
