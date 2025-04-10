import { useState } from 'react'
import { Form, useFetcher, useSubmit } from 'react-router'

import { CircleX, PlusCircle } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import type { SubCategory } from '~/lib/db/schema'
import { generateSlug } from '~/lib/utils/seo'

import { actionRoute } from '..'
import type { CategoryType } from '../type'

// Category Component
const CategoryComponent = ({
	cat,
	selectedCategoryId,
	onClick,
}: {
	cat: CategoryType & { _isPending?: true }
	selectedCategoryId: number | null
	onClick: () => void
}) => {
	const fetcher = useFetcher()
	const isDeleting = fetcher.state !== 'idle'

	return (
		<div
			className={`flex justify-between items-center p-3 rounded-md bg-muted transition-colors ${
				isDeleting ? 'opacity-50' : ''
			}
            ${cat._isPending ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${
							selectedCategoryId === cat.id
								? 'bg-primary text-primary-foreground'
								: 'bg-muted hover:bg-muted/80'
						}
            `}
			onClick={onClick}
		>
			<div className="font-medium">
				{cat.name}
				<p className="text-sm text-muted-foreground">
					{cat.subCategories.length} 個子類別
				</p>
			</div>
			<CircleX
				className={
					'h-5 w-5' +
					(isDeleting || cat._isPending
						? ' opacity-50 cursor-not-allowed'
						: ' cursor-pointer hover:text-destructive')
				}
				onClick={e => {
					e.stopPropagation()

					if (isDeleting || cat._isPending) return

					fetcher.submit(
						{ id: cat.id, intent: 'category' },
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

// SubCategory Component
const SubCategoryComponent = ({
	subcategory,
}: {
	subcategory: SubCategory & { _isPending?: true }
}) => {
	const fetcher = useFetcher()
	const isDeleting = fetcher.state !== 'idle'

	return (
		<div
			className={`flex justify-between items-center p-3 rounded-md bg-muted ${
				isDeleting ? 'opacity-50' : ''
			}`}
		>
			<div className="font-medium">{subcategory.name}</div>
			<CircleX
				className={
					'h-5 w-5' +
					(isDeleting || subcategory._isPending
						? ' opacity-50 cursor-not-allowed'
						: ' cursor-pointer hover:text-destructive')
				}
				onClick={() => {
					if (isDeleting || subcategory._isPending) return

					fetcher.submit(
						{ id: subcategory.id, intent: 'subcategory' },
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

export const generateNewCategory = (newCategoryName: string) => {
	return {
		id: -(Math.floor(Math.random() * 2147483648) + 1),
		name: newCategoryName,
		slug: generateSlug(newCategoryName),
		description: '',
		subCategories: [],
		posts: [],
	} satisfies CategoryType
}

// Categories Section Component (Middle)
export const CategoriesSection = ({
	categories,
	selectedCategoryId,
	setSelectedCategoryId,
}: {
	categories: (CategoryType & { _isPending?: true })[]
	selectedCategoryId: number | null
	setSelectedCategoryId: (id: number) => void
}) => {
	const [newCategoryName, setNewCategoryName] = useState('')
	const submit = useSubmit()

	const addCategory = () => {
		if (!newCategoryName.trim()) return

		const newCategory = generateNewCategory(newCategoryName)

		submit(
			{ ...newCategory, intent: 'category' },
			{ method: 'POST', action: actionRoute, navigate: false },
		)
		setNewCategoryName('')
	}

	const handleCategorySelect = (id: number) => {
		setSelectedCategoryId(id)
	}

	return (
		<div className="border rounded-lg p-4 shadow-xs">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">類別</h2>
			</div>

			<Form
				onSubmit={e => {
					e.preventDefault()
					addCategory()
				}}
				className="flex gap-2 mb-4"
			>
				<Input
					placeholder="新增類別名稱"
					value={newCategoryName}
					onChange={e => setNewCategoryName(e.target.value)}
					className="flex-1"
				/>
				<Button type="submit" size="sm">
					<PlusCircle className="h-4 w-4 mr-2" />
					新增
				</Button>
			</Form>

			<ScrollArea className="h-[400px] pr-4">
				<div className="space-y-2">
					{categories.map(category => (
						<CategoryComponent
							cat={category}
							key={category.id}
							selectedCategoryId={selectedCategoryId}
							onClick={() =>
								!category._isPending && handleCategorySelect(category.id)
							}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	)
}

export const generateNewSubCategory = (
	newSubcategoryName: string,
	categoryId: number,
) => {
	return {
		id: -(Math.floor(Math.random() * 2147483648) + 1),
		name: newSubcategoryName,
		slug: generateSlug(newSubcategoryName),
		description: '',
		categoryId,
		parentId: categoryId,
	} satisfies SubCategory & { parentId: number }
}

// Subcategories Section Component (Right)
export const SubcategoriesSection = ({
	category,
}: {
	category: CategoryType | null
}) => {
	const [newSubcategoryName, setNewSubcategoryName] = useState('')
	const submit = useSubmit()

	const addSubcategory = () => {
		if (!category?.id || !newSubcategoryName.trim()) return

		const newSubcategory = generateNewSubCategory(
			newSubcategoryName,
			category.id,
		)

		submit(
			{ ...newSubcategory, intent: 'subcategory' },
			{ method: 'POST', action: actionRoute, navigate: false },
		)
		setNewSubcategoryName('')
	}

	return (
		<div className="border rounded-lg p-4 shadow-xs">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">
					{category ? `${category?.name} 的子類別` : '子類別'}
				</h2>
			</div>

			{category ? (
				<>
					<Form
						onSubmit={e => {
							e.preventDefault()
							addSubcategory()
						}}
						className="flex gap-2 mb-4"
					>
						<Input
							placeholder="新增子類別名稱"
							value={newSubcategoryName}
							onChange={e => setNewSubcategoryName(e.target.value)}
							className="flex-1"
						/>
						<Button type="submit" size="sm">
							<PlusCircle className="h-4 w-4 mr-2" />
							新增
						</Button>
					</Form>

					<ScrollArea className="h-[400px] pr-4">
						<div className="space-y-2">
							{category.subCategories.length > 0 ? (
								category.subCategories.map(subcategory => (
									<SubCategoryComponent
										subcategory={subcategory}
										key={subcategory.id}
									/>
								))
							) : (
								<div className="text-center py-8 text-muted-foreground">
									尚無子類別
								</div>
							)}
						</div>
					</ScrollArea>
				</>
			) : (
				<div className="flex items-center justify-center h-[400px] text-muted-foreground">
					請選擇一個類別以查看或新增子類別
				</div>
			)}
		</div>
	)
}
