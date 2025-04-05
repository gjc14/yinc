import { useMemo, useState } from 'react'

import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import { useAdminBlogContext } from '../_papa.admin.blog/route'
import { CategoriesSection, SubcategoriesSection } from './components/category'
import { TagsSection } from './components/tag'
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
    const pendingTags = usePendingTags()
    const pendingCategories = usePendingCategories()
    const pendingSubCategories = usePendingSubCategories()

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null
    )

    const tags = useMemo(
        () => [
            ...tagsLoader.map(tag => {
                return {
                    ...tag,
                    posts: postsLoader.filter(post =>
                        post.tags.map(t => t.id).includes(tag.id)
                    ),
                }
            }),
            ...pendingTags.filter(
                pendingTag =>
                    !tagsLoader.some(tag => tag.slug === pendingTag.slug)
            ),
        ],
        [tagsLoader, postsLoader, pendingTags]
    )

    const categories = useMemo(
        () => [
            ...categoriesLoader.map(category => {
                const thisPendingSub = pendingSubCategories.filter(
                    pendingSubCategory =>
                        pendingSubCategory.categoryId === category.id
                )
                return {
                    ...category,
                    subCategories: [
                        ...category.subCategories,
                        ...thisPendingSub.filter(
                            p =>
                                !category.subCategories.some(
                                    sub => sub.slug === p.slug
                                )
                        ),
                    ],
                    posts: postsLoader.filter(post =>
                        post.categories.map(c => c.id).includes(category.id)
                    ),
                }
            }),
            ...pendingCategories.filter(
                pendingCategory =>
                    !categoriesLoader.some(
                        category => category.slug === pendingCategory.slug
                    )
            ),
        ],
        [categoriesLoader, postsLoader, pendingSubCategories, pendingCategories]
    )

    const selectedCategory = useMemo(
        () =>
            categories.find(category => category.id === selectedCategoryId) ??
            null,
        [categories, selectedCategoryId]
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
