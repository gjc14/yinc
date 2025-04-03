import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import { useAdminBlogContext } from '../_papa.admin.blog/route'
import {
    usePendingCategories,
    usePendingSubCategories,
    usePendingTags,
} from './utils'

export const actionRoute = '/admin/blog/taxonomy/resource'

export default function AdminTaxonomy() {
    const { tags, categories, posts } = useAdminBlogContext()
    const pendingTags = usePendingTags()
    const pendingCategories = usePendingCategories()
    const pendingSubCategories = usePendingSubCategories()

    const tagsWithPostsAndOptimistic = [
        ...tags.map(tag => {
            return {
                ...tag,
                posts: posts.filter(post =>
                    post.tags.map(t => t.id).includes(tag.id)
                ),
            }
        }),
        ...pendingTags.filter(
            pendingTag => !tags.some(tag => tag.slug === pendingTag.slug)
        ),
    ]
    const categoriesWithPostsAndOptimistic = [
        ...categories.map(category => {
            return {
                ...category,
                subCategories: [
                    ...category.subCategories,
                    ...pendingSubCategories.filter(
                        pendingSubCategory =>
                            !category.subCategories.some(
                                subCategory =>
                                    subCategory.slug === pendingSubCategory.slug
                            )
                    ),
                ],
                posts: posts.filter(post =>
                    post.categories.map(c => c.id).includes(category.id)
                ),
            }
        }),
        ...pendingCategories.filter(
            pendingCategory =>
                !categories.some(
                    category => category.slug === pendingCategory.slug
                )
        ),
    ]

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle
                    title="Taxonomy"
                    description="SEO data is connect to post or route. You could set in either here or in post or route."
                ></AdminTitle>
                <AdminActions></AdminActions>
            </AdminHeader>
        </AdminSectionWrapper>
    )
}
