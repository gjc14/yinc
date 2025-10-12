import { useMemo, useState } from 'react'

import { useAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { nanoid } from 'nanoid'

import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '~/components/ui/item'

import { productAtom } from '../context'

type DetailType = NonNullable<
	NonNullable<ReturnType<typeof productAtom.read>>['details']
>[number]

// Add _id for internal tracking
type DetailWithId = DetailType & { _id: string }

export const Details = () => {
	const [product, setProduct] = useAtom(productAtom)

	// useMemo to ensure each detail has a unique and stable _id
	const detailsWithIds = useMemo<DetailWithId[]>(() => {
		if (!product || !product.details) return []
		return product.details.map(d => ({
			...d,
			_id: (d as DetailWithId)._id || nanoid(),
		}))
	}, [product?.details])

	const handleAddDetail = () => {
		if (!product) return
		const newDetail: DetailWithId = {
			order: detailsWithIds.length,
			title: 'New Detail',
			content: 'Content here',
			_id: nanoid(),
		}
		setProduct({
			...product,
			details: [...detailsWithIds, newDetail],
		})
	}

	const handleUpdateDetail = (updatedDetail: DetailWithId) => {
		if (!product) return
		setProduct({
			...product,
			details: detailsWithIds.map(d =>
				d._id === updatedDetail._id ? updatedDetail : d,
			),
		})
	}

	const handleDeleteDetail = (id: string) => {
		if (!product) return
		setProduct({
			...product,
			details: detailsWithIds.filter(d => d._id !== id),
		})
	}

	if (!product) return null

	return (
		<Card>
			<CardHeader>
				<CardTitle>Details</CardTitle>
				<CardDescription>
					Every detail will help your customers make the right choice. e.g. How
					To Use; Ingredients.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				{detailsWithIds.length > 0 ? (
					detailsWithIds.map(detail => (
						<DetailItem
							key={detail._id}
							detail={detail}
							onUpdate={handleUpdateDetail}
							onDelete={handleDeleteDetail}
						/>
					))
				) : (
					<p className="text-muted-foreground rounded-md border p-3 text-center text-sm">
						No details added yet. Click "Add Detail" to create one.
					</p>
				)}
			</CardContent>
			<CardFooter>
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={handleAddDetail}
				>
					<Plus />
					Add Detail
				</Button>
			</CardFooter>
		</Card>
	)
}

function DetailItem({
	detail,
	onUpdate,
	onDelete,
}: {
	detail: DetailWithId
	onUpdate: (updatedDetail: DetailWithId) => void
	onDelete: (id: string) => void
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [editedDetail, setEditedDetail] = useState(detail)

	return (
		<Item variant="outline">
			{isEditing ? (
				<ItemContent>
					<Input
						value={editedDetail.title}
						onChange={e =>
							setEditedDetail({ ...editedDetail, title: e.target.value })
						}
						placeholder="Title"
					/>
					<Input
						value={editedDetail.content || ''}
						onChange={e =>
							setEditedDetail({ ...editedDetail, content: e.target.value })
						}
						placeholder="Content"
					/>
					<div className="mt-2 flex gap-2">
						<Button
							size="sm"
							onClick={() => {
								onUpdate(editedDetail)
								setIsEditing(false)
							}}
						>
							Save
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setEditedDetail(detail) // Reset to original
								setIsEditing(false)
							}}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => onDelete(detail._id)}
							className="ml-auto"
						>
							Delete
						</Button>
					</div>
				</ItemContent>
			) : (
				<>
					<ItemContent>
						<ItemTitle>{detail.title || 'Untitled'}</ItemTitle>
						<ItemDescription>{detail.content || 'No content'}</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditing(true)}
						>
							Edit
						</Button>
					</ItemActions>
				</>
			)}
		</Item>
	)
}
