import { useMemo, useState } from 'react'

import type { SubCategory } from '~/lib/db/schema'
import {
	AdminActions,
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'

import { useAdminBlogContext } from '../layout'
import { CategoriesSection, SubcategoriesSection } from './components/category'
import { TagsSection } from './components/tag'
import type { CategoryType, TagType } from './type'
import {
	usePendingCategories,
	usePendingSubCategories,
	usePendingTags,
} from './utils'

export const actionRoute = '/admin/blog/taxonomy/resource'

// Main Component
export default function AdminTaxonomy() {
	const {
		tags: tagsLoader,
		categories: categoriesLoader,
		posts: postsLoader,
	} = useAdminBlogContext()

	const pendingTags: (TagType & { _isPending: true })[] = usePendingTags().map(
		p => ({ ...p, _isPending: true }),
	)
	const pendingCategories: (CategoryType & { _isPending: true })[] =
		usePendingCategories().map(p => ({ ...p, _isPending: true }))
	const pendingSubCategories: (SubCategory & { _isPending: true })[] =
		usePendingSubCategories().map(p => ({ ...p, _isPending: true }))

	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null,
	)

	const tags: (TagType & { _isPending?: true })[] = useMemo(
		() => [
			...tagsLoader.map(tag => {
				return {
					...tag,
					posts: postsLoader.filter(post =>
						post.tags.map(t => t.id).includes(tag.id),
					),
				}
			}),
			...pendingTags.filter(
				pendingTag => !tagsLoader.some(tag => tag.slug === pendingTag.slug),
			),
		],
		[tagsLoader, postsLoader, pendingTags],
	)

	const categories: (CategoryType & { _isPending?: true })[] = useMemo(
		() => [
			...categoriesLoader.map(category => {
				const thisPendingSub = pendingSubCategories.filter(
					pendingSubCategory => pendingSubCategory.categoryId === category.id,
				)
				return {
					...category,
					subCategories: [
						...category.subCategories,
						...thisPendingSub.filter(
							p => !category.subCategories.some(sub => sub.slug === p.slug),
						),
					],
					posts: postsLoader.filter(post =>
						post.categories.map(c => c.id).includes(category.id),
					),
				}
			}),
			...pendingCategories.filter(
				pendingCategory =>
					!categoriesLoader.some(
						category => category.slug === pendingCategory.slug,
					),
			),
		],
		[categoriesLoader, postsLoader, pendingSubCategories, pendingCategories],
	)

	const selectedCategory = useMemo(
		() =>
			categories.find(category => category.id === selectedCategoryId) ?? null,
		[categories, selectedCategoryId],
	)

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle
					title="Taxonomy"
					description="SEO data is connect to post or route. You could set in either here or in post or route."
				></AdminTitle>
				<AdminActions></AdminActions>
			</AdminHeader>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Tags Section (Left) */}
				<TagsSection tags={tags} />

				{/* Categories Section (Middle) */}
				<CategoriesSection
					categories={categories}
					selectedCategoryId={selectedCategoryId}
					setSelectedCategoryId={setSelectedCategoryId}
				/>

				{/* Subcategories Section (Right) */}
				<SubcategoriesSection category={selectedCategory} />
			</div>
		</AdminSectionWrapper>
	)
}
