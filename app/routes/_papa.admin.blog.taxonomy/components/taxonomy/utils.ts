import { useFetchers } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { PostWithRelations } from '~/lib/db/post.server'

import { Category, SubCategory, Tag } from '~/lib/db/schema'

const usePendingCategories = (): typeof pendingState => {
    const fetchers = useFetchers()
    const pendingState = useState<
        (Category & { subCategories: SubCategory[] } & {
            posts: PostWithRelations[]
        })[]
    >([])
    const [categoriesPendingAdd, setCategoriesPendingAdd] = pendingState

    useEffect(() => {
        // Categories
        const fetchersAddingCategory = fetchers.filter(fetcher => {
            if (!fetcher.formData) return false
            const gotchaCategory = fetcher.formData.get('intent') === 'category'
            const isPOST = fetcher.formMethod === 'POST'
            const isSubmitting = fetcher.state === 'submitting'
            return gotchaCategory && isPOST && isSubmitting
        })

        const newPendingCategories = fetchersAddingCategory
            .map(fetcher => {
                return {
                    id: Number(fetcher.formData?.get('id')),
                    name: String(fetcher.formData?.get('name')),
                    slug: '',
                    description: '',
                    subCategories: [],
                    posts: [],
                } as Category & { subCategories: SubCategory[] } & {
                    posts: PostWithRelations[]
                }
            })
            .filter(
                category =>
                    !categoriesPendingAdd.some(p => p.id === category.id)
            )

        if (newPendingCategories.length > 0) {
            setCategoriesPendingAdd(newPendingCategories)
        }
    }, [fetchers])

    return pendingState
}

const usePendingSubCategories = (): typeof pendingState => {
    const fetchers = useFetchers()
    const pendingState = useState<SubCategory[]>([])
    const [subCategoriesPendingAdd, setSubCategoriesPendingAdd] = pendingState

    useEffect(() => {
        // Subcategories
        const fetchersAddingSubCategory = fetchers.filter(fetcher => {
            if (!fetcher.formData) return false
            const gotchaSubCategory =
                fetcher.formData.get('intent') === 'subcategory'
            const isPOST = fetcher.formMethod === 'POST'
            const isSubmitting = fetcher.state === 'submitting'
            return gotchaSubCategory && isPOST && isSubmitting
        })

        const newPendingSubCategories = fetchersAddingSubCategory
            .map(fetcher => {
                return {
                    id: Number(fetcher.formData?.get('id')),
                    name: String(fetcher.formData?.get('name')),
                    categoryId: Number(fetcher.formData?.get('parentId')),
                    description: '',
                    slug: '',
                } as SubCategory
            })
            .filter(
                subCategory =>
                    !subCategoriesPendingAdd.some(p => p.id === subCategory.id)
            )

        if (newPendingSubCategories.length > 0) {
            setSubCategoriesPendingAdd(newPendingSubCategories)
        }
    }, [fetchers])

    return pendingState
}

const usePendingTags = (): typeof pendingState => {
    const fetchers = useFetchers()
    const pendingState = useState<(Tag & { posts: PostWithRelations[] })[]>([])
    const [tagsPendingAdd, setTagsPendingAdd] = pendingState

    useEffect(() => {
        const fetchersAddingTag = fetchers.filter(fetcher => {
            if (!fetcher.formData) return false
            const gotchaTag = fetcher.formData.get('intent') === 'tag'
            const isPOST = fetcher.formMethod === 'POST'
            const isSubmitting = fetcher.state === 'submitting'
            return gotchaTag && isPOST && isSubmitting
        })

        const newPendingTags = fetchersAddingTag
            .map(fetcher => {
                return {
                    id: Number(fetcher.formData?.get('id')),
                    name: String(fetcher.formData?.get('name')),
                    description: '',
                    slug: '',
                    posts: [],
                } as Tag & { posts: PostWithRelations[] }
            })
            .filter(tag => !tagsPendingAdd?.some(p => p.id === tag.id))

        if (newPendingTags.length > 0) {
            setTagsPendingAdd(newPendingTags)
        }
    }, [fetchers])

    return pendingState
}

export { usePendingCategories, usePendingSubCategories, usePendingTags }
