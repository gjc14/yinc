import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router'

import { CloudAlert } from 'lucide-react'

import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { capitalize } from '~/lib/utils'
import {
	AdminActions,
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'

import { FileGrid } from './components/file-grid'
import type { loader } from './resource'
import { MIMETypes } from './utils'

const displayOptions = ['all', 'file', ...MIMETypes]

export { loader } from './resource'

export default function AdminAsset() {
	const { hasObjectStorage, files, origin } = useLoaderData<typeof loader>()
	const [filesState, setFilesState] = useState(files)
	const [display, setDisplay] = useState<(typeof displayOptions)[number]>('all')

	const filesDisplayed = filesState.filter(file => {
		if (display === 'all') return true
		if (display === 'file') {
			const fileGeneralType = file.type.split('/')[0]
			return ['application', 'model', 'font', 'text'].includes(fileGeneralType)
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
								file.id === fileMeta.id ? fileMeta : file,
							),
						)
					}}
					origin={origin}
				/>
			) : (
				<div className="border rounded-xl w-full h-full min-h-60 grow flex flex-col items-center justify-center gap-3">
					<CloudAlert size={50} />
					<p className="text-center text-pretty max-w-sm">
						Please setup your S3 Object Storage to start uploading assets
					</p>
				</div>
			)}
		</AdminSectionWrapper>
	)
}
