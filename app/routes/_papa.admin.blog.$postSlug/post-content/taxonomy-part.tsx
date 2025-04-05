/**
 * Contains the taxonomy part of the post editor
 * This includes the categories and tags
 */

import { MultiSelect } from '~/components/multi-select'
import { Label } from '~/components/ui/label'
import { PostWithRelations } from '~/lib/db/post.server'
import { Category, Tag } from '~/lib/db/schema'

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
                                areSelected.some(s => +s.value === c.id)
                            )

                            setPostState(prev => {
                                const newPost = {
                                    ...prev,
                                    categories: selectedCat,
                                } satisfies PostWithRelations
                                return newPost
                            })
                        }}
                        onEnterNewValue={() => {
                            // TODO: Add to create require state
                            return 'new-id-' + Date.now()
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
                                areSelected.some(s => +s.value === t.id)
                            )

                            setPostState(prev => {
                                const newPost = {
                                    ...prev,
                                    tags: selectedTags,
                                } satisfies PostWithRelations
                                return newPost
                            })
                        }}
                        onEnterNewValue={() => {
                            // TODO: Add to create require state
                            return 'new-id-' + Date.now()
                        }}
                    />
                </div>
            </div>
        </>
    )
}
