import { CircleX, PlusCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useFetcher, useSubmit } from '@remix-run/react'
import { Form } from 'react-router-dom'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { SubCategory } from '~/lib/db/schema'
import { generateSlug } from '~/lib/utils'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import { useAdminBlogContext } from '../_papa.admin.blog/route'
import { CategoryType, TagType } from './type'
import {
    usePendingCategories,
    usePendingSubCategories,
    usePendingTags,
} from './utils'

export const actionRoute = '/admin/blog/taxonomy/resource'

// Tag Component
const TagComponent = ({ tag }: { tag: TagType }) => {
    const fetcher = useFetcher()
    const isDeleting = fetcher.state !== 'idle'

    return (
        <div
            className={`flex justify-between items-center p-3 rounded-md bg-muted ${
                isDeleting ? 'opacity-50' : ''
            }`}
        >
            <div className="font-medium">{tag.name}</div>
            <CircleX
                className={
                    'h-5 w-5' +
                    (isDeleting
                        ? ' opacity-50 cursor-not-allowed'
                        : ' cursor-pointer hover:text-destructive')
                }
                onClick={() => {
                    if (isDeleting) return

                    fetcher.submit(
                        { id: tag.id, intent: 'tag' },
                        {
                            method: 'DELETE',
                            action: actionRoute,
                        }
                    )
                }}
            />
        </div>
    )
}

// Category Component
const CategoryComponent = ({
    cat,
    selectedCategoryId,
    onClick,
}: {
    cat: CategoryType
    selectedCategoryId: number | null
    onClick: () => void
}) => {
    const fetcher = useFetcher()
    const isDeleting = fetcher.state !== 'idle'

    return (
        <div
            className={`flex justify-between items-center p-3 rounded-md bg-muted transition-colors ${
                isDeleting ? 'opacity-50' : ''
            }
            ${
                selectedCategoryId === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
            }
            `}
            onClick={onClick}
        >
            <div className="font-medium">
                {cat.name}
                <p className="text-sm text-muted-foreground">
                    {cat.subCategories.length} 個子類別
                </p>
            </div>
            <CircleX
                className={
                    'h-5 w-5' +
                    (isDeleting
                        ? ' opacity-50 cursor-not-allowed'
                        : ' cursor-pointer hover:text-destructive')
                }
                onClick={e => {
                    e.stopPropagation()

                    if (isDeleting) return

                    fetcher.submit(
                        { id: cat.id, intent: 'category' },
                        {
                            method: 'DELETE',
                            action: actionRoute,
                        }
                    )
                }}
            />
        </div>
    )
}

// SubCategory Component
const SubCategoryComponent = ({
    subcategory,
}: {
    subcategory: SubCategory
}) => {
    const fetcher = useFetcher()
    const isDeleting = fetcher.state !== 'idle'

    return (
        <div
            className={`flex justify-between items-center p-3 rounded-md bg-muted ${
                isDeleting ? 'opacity-50' : ''
            }`}
        >
            <div className="font-medium">{subcategory.name}</div>
            <CircleX
                className={
                    'h-5 w-5' +
                    (isDeleting
                        ? ' opacity-50 cursor-not-allowed'
                        : ' cursor-pointer hover:text-destructive')
                }
                onClick={() => {
                    if (isDeleting) return

                    fetcher.submit(
                        { id: subcategory.id, intent: 'subcategory' },
                        {
                            method: 'DELETE',
                            action: actionRoute,
                        }
                    )
                }}
            />
        </div>
    )
}

// Tags Section Component (Left)
const TagsSection = ({ tags }: { tags: TagType[] }) => {
    const [newTagName, setNewTagName] = useState('')
    const submit = useSubmit()

    const addTag = () => {
        if (!newTagName.trim()) return

        const newTag = {
            id: -Math.random() * 1000,
            name: newTagName,
            slug: generateSlug(newTagName),
            description: '',
            posts: [],
        } satisfies TagType

        submit(
            { ...newTag, intent: 'tag' },
            { method: 'POST', action: actionRoute, navigate: false }
        )
        setNewTagName('')
    }

    return (
        <div className="border rounded-lg p-4 shadow-sm col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">標籤</h2>
            </div>

            <Form
                onSubmit={e => {
                    e.preventDefault()
                    addTag()
                }}
                className="flex gap-2 mb-4"
            >
                <Input
                    placeholder="新增標籤名稱"
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    新增
                </Button>
            </Form>

            <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                    {tags.length > 0 ? (
                        tags.map(tag => <TagComponent tag={tag} key={tag.id} />)
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            尚無標籤
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

// Categories Section Component (Middle)
const CategoriesSection = ({
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
}: {
    categories: CategoryType[]
    selectedCategoryId: number | null
    setSelectedCategoryId: (id: number) => void
}) => {
    const [newCategoryName, setNewCategoryName] = useState('')
    const submit = useSubmit()

    const addCategory = () => {
        if (!newCategoryName.trim()) return

        const newCategory = {
            id: -Math.random() * 1000,
            name: newCategoryName,
            slug: generateSlug(newCategoryName),
            description: '',
            subCategories: [],
            posts: [],
        } satisfies CategoryType

        submit(
            { ...newCategory, intent: 'category' },
            { method: 'POST', action: actionRoute, navigate: false }
        )
        setNewCategoryName('')
    }

    const handleCategorySelect = (id: number) => {
        setSelectedCategoryId(id)
    }

    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">類別</h2>
            </div>

            <Form
                onSubmit={e => {
                    e.preventDefault()
                    addCategory()
                }}
                className="flex gap-2 mb-4"
            >
                <Input
                    placeholder="新增類別名稱"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    新增
                </Button>
            </Form>

            <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                    {categories.map(category => (
                        <CategoryComponent
                            cat={category}
                            key={category.id}
                            selectedCategoryId={selectedCategoryId}
                            onClick={() => handleCategorySelect(category.id)}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

// Subcategories Section Component (Right)
const SubcategoriesSection = ({
    category,
}: {
    category: CategoryType | null
}) => {
    const [newSubcategoryName, setNewSubcategoryName] = useState('')
    const submit = useSubmit()

    const addSubcategory = () => {
        if (!category?.id || !newSubcategoryName.trim()) return

        const newSubcategory = {
            id: -Math.random() * 1000,
            name: newSubcategoryName,
            slug: generateSlug(newSubcategoryName),
            description: '',
            categoryId: category.id,
            parentId: category.id,
        } satisfies SubCategory & { parentId: number }

        submit(
            { ...newSubcategory, intent: 'subcategory' },
            { method: 'POST', action: actionRoute, navigate: false }
        )
        setNewSubcategoryName('')
    }

    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {category ? `${category?.name} 的子類別` : '子類別'}
                </h2>
            </div>

            {category ? (
                <>
                    <Form
                        onSubmit={e => {
                            e.preventDefault()
                            addSubcategory()
                        }}
                        className="flex gap-2 mb-4"
                    >
                        <Input
                            placeholder="新增子類別名稱"
                            value={newSubcategoryName}
                            onChange={e =>
                                setNewSubcategoryName(e.target.value)
                            }
                            className="flex-1"
                        />
                        <Button type="submit" size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            新增
                        </Button>
                    </Form>

                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-2">
                            {category.subCategories.length > 0 ? (
                                category.subCategories.map(subcategory => (
                                    <SubCategoryComponent
                                        subcategory={subcategory}
                                        key={subcategory.id}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    尚無子類別
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </>
            ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    請選擇一個類別以查看或新增子類別
                </div>
            )}
        </div>
    )
}

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
