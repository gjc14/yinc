import { SubCategory } from '@prisma/client'
import { Close, PopoverTrigger } from '@radix-ui/react-popover'
import { Form, useSubmit } from '@remix-run/react'
import { ObjectId } from 'bson'
import { XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent } from '~/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { CategoriesFromDB } from '~/lib/db/blog-taxonomy.server'
import { actionRoute } from '.'

const SubCategoryPart = (props: {
    categories: CategoriesFromDB
    onDelete: (categoryId: string, subCategoryId: string) => void
}) => {
    const submit = useSubmit()
    const { categories, onDelete } = props

    // Getting subCategories
    const [selectedCatId, setSelectedCatId] = useState<string>('')
    const selectedCat = categories?.find(cat => cat.id === selectedCatId)
    const subCategories = selectedCat?.subCategories || null

    useEffect(() => {
        if (!categories?.some(cat => cat.id === selectedCatId)) {
            setSelectedCatId('')
        }
    }, [categories])

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label className="flex items-center gap-x-1.5">
                    Subcategory
                </Label>
            </div>

            <div className="flex items-center gap-3">
                <Select
                    value={selectedCatId ?? ''}
                    onValueChange={v => {
                        setSelectedCatId(v)
                    }}
                >
                    <SelectTrigger
                        disabled={
                            categories === null || categories.length === 0
                        }
                    >
                        <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {categories?.map(category => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Popover modal>
                    <PopoverTrigger
                        asChild
                        disabled={
                            categories === null ||
                            categories.length === 0 ||
                            !selectedCatId
                        }
                    >
                        <Button variant={'outline'}>
                            Add a new Subcategory
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Form
                            className="w-full space-y-1.5"
                            onSubmit={e => {
                                e.preventDefault()

                                const formData = new FormData(e.currentTarget)
                                formData.set('id', new ObjectId().toString())

                                submit(formData, {
                                    method: 'POST',
                                    action: actionRoute,
                                    navigate: false,
                                })
                            }}
                        >
                            <input
                                type="hidden"
                                name="intent"
                                value="subcategory"
                            />
                            <input
                                type="hidden"
                                name="parentId"
                                value={selectedCatId}
                            />
                            <Input
                                type="text"
                                placeholder="Subcategory name"
                                name="name"
                            />
                            <Close asChild>
                                <Button type="submit" className="mt-2 w-full">
                                    Save
                                </Button>
                            </Close>
                        </Form>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="col-span-2 flex flex-wrap items-center gap-1">
                {subCategories && subCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                        {subCategories.map(subcategory => (
                            <SubcategoryItem
                                key={subcategory.id}
                                subcategory={subcategory}
                                onDelete={id => {
                                    if (!selectedCatId) return
                                    onDelete(selectedCatId, id)
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export const SubcategoryItem = (props: {
    subcategory: SubCategory
    onDelete?: (id: string) => void
}) => {
    const submit = useSubmit()

    return (
        <div className="flex gap-0.5 items-center">
            <Badge>{props.subcategory.name}</Badge>
            <XCircle
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                    props.onDelete?.(props.subcategory.id)
                    submit(
                        { id: props.subcategory.id, intent: 'subcategory' },
                        {
                            method: 'DELETE',
                            action: actionRoute,
                            navigate: false,
                        }
                    )
                }}
            />
        </div>
    )
}

export { SubCategoryPart }
