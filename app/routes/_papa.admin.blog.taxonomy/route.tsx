import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { TaxonomyDialog } from '~/routes/_papa.admin.blog.taxonomy/components/taxonomy'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import { DataTable } from '~/routes/_papa.admin/components/data-table'
import { useAdminBlogContext } from '../_papa.admin.blog/route'
import { categoryColumns, tagColumns } from './components/columns'
import { TaxonomyStateProvider } from './context'

export default function AdminTaxonomy() {
    const { tags, categories, posts } = useAdminBlogContext()
    const [tagsState, setTagsState] = useState(
        tags.map(tag => {
            return {
                ...tag,
                posts: posts.filter(post =>
                    post.tags.map(t => t.id).includes(tag.id)
                ),
            }
        })
    )
    const [categoriesState, setCategoriesState] = useState(
        categories.map(category => {
            return {
                ...category,
                posts: posts.filter(post =>
                    post.categories.map(c => c.id).includes(category.id)
                ),
            }
        })
    )

    return (
        <TaxonomyStateProvider
            value={{
                tagsState,
                setTagsState,
                categoriesState,
                setCategoriesState,
            }}
        >
            <AdminSectionWrapper>
                <AdminHeader>
                    <AdminTitle
                        title="Taxonomy"
                        description="SEO data is connect to post or route. You could set in either here or in post or route."
                    ></AdminTitle>
                    <AdminActions>
                        <TaxonomyDialog>
                            <Button size={'sm'}>
                                <PlusCircle size={16} />
                                <p className="text-xs">Create Taxonomy</p>
                            </Button>
                        </TaxonomyDialog>
                    </AdminActions>
                </AdminHeader>

                <Separator />

                <h3>Tags</h3>
                <DataTable columns={tagColumns} data={tagsState}>
                    {table => (
                        <Input
                            placeholder="Filter tags..."
                            value={
                                (table
                                    .getColumn('name')
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={event =>
                                table
                                    .getColumn('name')
                                    ?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    )}
                </DataTable>

                <Separator />

                <h3>Categories</h3>
                <DataTable columns={categoryColumns} data={categoriesState}>
                    {table => (
                        <Input
                            placeholder="Filter categories..."
                            value={
                                (table
                                    .getColumn('name')
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={event =>
                                table
                                    .getColumn('name')
                                    ?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    )}
                </DataTable>
            </AdminSectionWrapper>
        </TaxonomyStateProvider>
    )
}
