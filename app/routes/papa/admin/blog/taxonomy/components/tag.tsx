import { useState } from 'react'
import { Form, useFetcher, useSubmit } from 'react-router'

import { CircleX, PlusCircle } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { generateSlug } from '~/lib/utils/seo'

import { actionRoute } from '..'
import type { TagType } from '../type'

// Tag Component
const TagComponent = ({ tag }: { tag: TagType & { _isPending?: true } }) => {
	const fetcher = useFetcher()
	const isDeleting = fetcher.state !== 'idle'

	return (
		<div
			className={`flex justify-between items-center p-3 rounded-md bg-muted ${
				isDeleting ? 'opacity-50' : ''
			}`}
		>
			<div className="font-medium">{tag.name}</div>
			<CircleX
				className={
					'h-5 w-5' +
					(isDeleting || tag._isPending
						? ' opacity-50 cursor-not-allowed'
						: ' cursor-pointer hover:text-destructive')
				}
				onClick={() => {
					if (isDeleting || tag._isPending) return

					fetcher.submit(
						{ id: tag.id, intent: 'tag' },
						{
							method: 'DELETE',
							action: actionRoute,
						},
					)
				}}
			/>
		</div>
	)
}

export const generateNewTag = (newTagName: string) => {
	let slug = generateSlug(newTagName)
	if (!slug) {
		slug = generateSlug(String(Date.now()))
	}

	return {
		id: -(Math.floor(Math.random() * 2147483648) + 1),
		name: newTagName,
		slug,
		description: '',
		posts: [],
	} satisfies TagType
}

// Tags Section Component (Left)
export const TagsSection = ({ tags }: { tags: TagType[] }) => {
	const [newTagName, setNewTagName] = useState('')
	const submit = useSubmit()

	const addTag = () => {
		if (!newTagName.trim()) return
		const newTag = generateNewTag(newTagName)

		submit(
			{ ...newTag, intent: 'tag' },
			{ method: 'POST', action: actionRoute, navigate: false },
		)
		setNewTagName('')
	}

	return (
		<div className="border rounded-lg p-4 shadow-xs col-span-1 sm:col-span-2 lg:col-span-1">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">標籤</h2>
			</div>

			<Form
				onSubmit={e => {
					e.preventDefault()
					addTag()
				}}
				className="flex gap-2 mb-4"
			>
				<Input
					placeholder="新增標籤名稱"
					value={newTagName}
					onChange={e => setNewTagName(e.target.value)}
					className="flex-1"
				/>
				<Button type="submit" size="sm">
					<PlusCircle className="h-4 w-4 mr-2" />
					新增
				</Button>
			</Form>

			<ScrollArea className="h-[400px] pr-4">
				<div className="space-y-2">
					{tags.length > 0 ? (
						tags.map(tag => <TagComponent tag={tag} key={tag.id} />)
					) : (
						<div className="text-center py-8 text-muted-foreground">
							尚無標籤
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	)
}
