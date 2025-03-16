import { SubCategory } from '@prisma/client'
import { useFetchers } from '@remix-run/react'
import { useEffect, useState } from 'react'

import { CategoriesFromDB, TagsFromDB } from '~/lib/db/blog-taxonomy.server'

const usePendingCategories = (): typeof pendingState => {
    const fetchers = useFetchers()
    const pendingState = useState<CategoriesFromDB>([])
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
            .map(fetcher => ({
                id: String(fetcher.formData?.get('id')),
                name: String(fetcher.formData?.get('name')),
                postIDs: [],
                subCategories: [],
            }))
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
    const pendingState = useState<CategoriesFromDB[number]['subCategories']>([])
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

        const newPendingSubCategories: SubCategory[] = fetchersAddingSubCategory
            .map(fetcher => ({
                id: String(fetcher.formData?.get('id')),
                name: String(fetcher.formData?.get('name')),
                postIDs: [],
                categoryId: String(fetcher.formData?.get('parentId')),
            }))
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
    const pendingState = useState<TagsFromDB>([])
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
            .map(fetcher => ({
                id: String(fetcher.formData?.get('id')),
                name: String(fetcher.formData?.get('name')),
                postIDs: [],
            }))
            .filter(tag => !tagsPendingAdd?.some(p => p.id === tag.id))

        if (newPendingTags.length > 0) {
            setTagsPendingAdd(newPendingTags)
        }
    }, [fetchers])

    return pendingState
}

export { usePendingCategories, usePendingSubCategories, usePendingTags }
