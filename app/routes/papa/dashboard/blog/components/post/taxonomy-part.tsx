/**
 * Contains the taxonomy (categories and tags) part of the post editor
 */

import { useAtom } from 'jotai'

import { Label } from '~/components/ui/label'
import { Loading } from '~/components/loading'
import { MultiSelect } from '~/components/multi-select'
import { generateNewCategory } from '~/routes/papa/dashboard/blog/taxonomy/components/category'
import { generateNewTag } from '~/routes/papa/dashboard/blog/taxonomy/components/tag'

import { categoriesAtom, editorAtom, postAtom, tagsAtom } from '../../context'

export const TaxonomyPart = () => {
	const [post, setPost] = useAtom(postAtom)
	const [editor] = useAtom(editorAtom)
	const [tags] = useAtom(tagsAtom)
	const [categories] = useAtom(categoriesAtom)

	if (!editor || !post) return <Loading />

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
						selected={post.categories.map(c => ({
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

							setPost(prev =>
								prev
									? {
											...prev,
											categories: [...selectedCat, ...newCatValues],
										}
									: prev,
							)
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
						selected={post.tags.map(t => ({
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

							setPost(prev =>
								prev
									? {
											...prev,
											tags: [...selectedTags, ...newTagValues],
										}
									: prev,
							)
						}}
					/>
				</div>
			</div>
		</>
	)
}
