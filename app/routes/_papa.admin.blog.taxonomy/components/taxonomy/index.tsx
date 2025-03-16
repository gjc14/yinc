/**
 * Please manage the state of tags and categories in the parent component.
 * This component will only manage the pending state of tags and categories.
 *
 * Optimistic POST/add:
 * 1. This component will return a callback of the POST fetchers on the fly (pending{Taxonomy}) as a taxonomy array
 * 2. Do not add pending a taxonomy array directly to the state you pass in, it will cause rerender and thus will cause the function getting pending taxonomy array loop
 *
 * Optimistic DELETE: Pass setState into the {taxonomy}Part component, and it will update state directly
 */
import { Tags } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '~/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { CategoriesFromDB, TagsFromDB } from '~/lib/db/blog-taxonomy.server'
import { useTaxonomyState } from '../../context'
import { CategoryPart } from './category-part'
import { SubCategoryPart } from './sub-category-part'
import { TagPart } from './tag-part'
import {
    usePendingCategories,
    usePendingSubCategories,
    usePendingTags,
} from './utils'

export const actionRoute = '/admin/blog/taxonomy/resource'

interface TaxonomyDialogProps {
    tagsState?: TagsFromDB
    setTagsState?: React.Dispatch<React.SetStateAction<TagsFromDB>>
    categoriesState?: CategoriesFromDB
    setCategoriesState?: React.Dispatch<React.SetStateAction<CategoriesFromDB>>
    children?: React.ReactNode
}

/**
 * Do not combine pending state to origin state that passed in.
 * It will cause rerender and loop because this component uses fetchers to pass out pendings.
 * Pass in taxonomy states. Use onPending{Taxonomy} to get pending states.
 */
export const TaxonomyDialog = ({
    tagsState: propTagsState,
    setTagsState: propSetTagsState,
    categoriesState: propCategoriesState,
    setCategoriesState: propSetCategoriesState,
    children,
}: TaxonomyDialogProps) => {
    // Get context values
    let contextValues
    try {
        contextValues = useTaxonomyState()
    } catch (error) {
        contextValues = {
            tagsState: [],
            setTagsState: () => {},
            categoriesState: [],
            setCategoriesState: () => {},
        }
    }

    const tagsState = propTagsState ?? contextValues.tagsState
    const setTagsState = propSetTagsState ?? contextValues.setTagsState
    const categoriesState = propCategoriesState ?? contextValues.categoriesState
    const setCategoriesState =
        propSetCategoriesState ?? contextValues.setCategoriesState

    const [tagsPendingAdd] = usePendingTags()

    const [categoriesPendingAdd] = usePendingCategories()
    const [subCategoriesPendingAdd] = usePendingSubCategories() // Should update allCategories when updated

    useEffect(() => {
        if (tagsPendingAdd.length === 0) return
        setTagsState(prev => [...prev, ...tagsPendingAdd])
    }, [tagsPendingAdd])

    useEffect(() => {
        if (categoriesPendingAdd.length === 0) return
        setCategoriesState(prev => [...prev, ...categoriesPendingAdd])
    }, [categoriesPendingAdd])

    useEffect(() => {
        if (subCategoriesPendingAdd.length === 0) return

        setCategoriesState(prev => {
            return prev.map(cat => {
                const filteredSubCategories = subCategoriesPendingAdd.filter(
                    sub => sub.categoryId === cat.id
                )
                if (filteredSubCategories.length === 0) return cat

                const newSubCategories = filteredSubCategories.filter(
                    newSub =>
                        !cat.subCategories.some(
                            existingSub => existingSub.id === newSub.id
                        )
                )

                if (newSubCategories.length === 0) return cat

                return {
                    ...cat,
                    subCategories: [...cat.subCategories, ...newSubCategories],
                }
            })
        })
    }, [subCategoriesPendingAdd])

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button variant="outline" size={'sm'}>
                        <Tags size={16} />
                        <span className="sr-only md:not-sr-only xs:whitespace-nowrap">
                            Edit Tags and Categories
                        </span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Edit Tags and Categories</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 pt-2">
                    <CategoryPart
                        categories={categoriesState}
                        onDelete={id => {
                            setCategoriesState(prev =>
                                prev.filter(cat => cat.id !== id)
                            )
                        }}
                    />

                    <Separator />

                    <SubCategoryPart
                        categories={categoriesState}
                        onDelete={(selectedCatId, id) => {
                            setCategoriesState(prev => {
                                // Map through Categories and remove the subcategory with selected id
                                return prev.map(cat => {
                                    if (cat.id !== selectedCatId) return cat

                                    return {
                                        ...cat,
                                        subCategories: cat.subCategories.filter(
                                            sub => sub.id !== id
                                        ),
                                    }
                                })
                            })
                        }}
                    />

                    <Separator />

                    <TagPart
                        tags={tagsState}
                        onDelete={id => {
                            setTagsState(prev =>
                                prev.filter(tag => tag.id !== id)
                            )
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
