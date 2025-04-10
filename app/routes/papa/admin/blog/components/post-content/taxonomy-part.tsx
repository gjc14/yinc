/**
 * Contains the taxonomy part of the post editor
 * This includes the categories and tags
 */

import { Label } from '~/components/ui/label'
import { MultiSelect } from '~/components/multi-select'
import type { PostWithRelations } from '~/lib/db/post.server'
import type { Category, Tag } from '~/lib/db/schema'
import { generateNewCategory } from '~/routes/papa/admin/blog/taxonomy/components/category'
import { generateNewTag } from '~/routes/papa/admin/blog/taxonomy/components/tag'

export const TaxonomyPart = ({
	postState,
	setPostState,
	tags,
	categories,
}: {
	postState: PostWithRelations
	setPostState: React.Dispatch<React.SetStateAction<PostWithRelations>>
	tags: Tag[]
	categories: Category[]
}) => {
	return (
		<>
			<div>
				<Label htmlFor="categories">Categories</Label>
				<div className="flex items-center gap-1.5">
					<MultiSelect
						options={categories.map(c => ({
							label: c.name,
							value: String(c.id),
						}))}
						selected={postState.categories.map(c => ({
							label: c.name,
							value: String(c.id),
						}))}
						onSelectedChange={areSelected => {
							const selectedCat = categories.filter(c =>
								areSelected.some(s => +s.value === c.id),
							)

							const newCatValues = areSelected
								.filter(
									selected =>
										!categories.some(c => String(c.id) === selected.value),
								)
								.map(nc => generateNewCategory(nc.label))

							setPostState(prev => ({
								...prev,
								categories: [...selectedCat, ...newCatValues],
							}))
						}}
					/>
				</div>
			</div>

			<div>
				<Label htmlFor="tags">Tags</Label>
				<div className="flex items-center gap-1.5">
					<MultiSelect
						options={tags.map(t => ({
							label: t.name,
							value: String(t.id),
						}))}
						selected={postState.tags.map(t => ({
							label: t.name,
							value: String(t.id),
						}))}
						onSelectedChange={areSelected => {
							const selectedTags = tags.filter(t =>
								areSelected.some(s => +s.value === t.id),
							)

							const newTagValues = areSelected
								.filter(
									selected => !tags.some(t => String(t.id) === selected.value),
								)
								.map(newTag => generateNewTag(newTag.label))

							setPostState(prev => ({
								...prev,
								tags: [...selectedTags, ...newTagValues],
							}))
						}}
					/>
				</div>
			</div>
		</>
	)
}
