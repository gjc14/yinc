import { Close, PopoverTrigger } from '@radix-ui/react-popover'
import { Form, useSubmit } from '@remix-run/react'
import { ObjectId } from 'bson'
import { XCircle } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent } from '~/components/ui/popover'
import { Category } from '~/lib/db/schema'
import { actionRoute } from '.'

const CategoryPart = (props: {
    categories: Category[]
    onDelete: (id: number) => void
}) => {
    const submit = useSubmit()
    const { categories, onDelete } = props

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label className="flex items-center gap-x-1.5">Category</Label>
            </div>

            <div className="flex items-center">
                <Popover modal>
                    <PopoverTrigger asChild>
                        <Button variant={'outline'}>Add a new Category</Button>
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
                                value="category"
                            />
                            <Input
                                type="text"
                                placeholder="Category name"
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
                {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground mx-3">
                        No category found
                    </p>
                )}
            </div>

            {categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                    {categories.map(category => (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            onDelete={id => onDelete(id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const CategoryItem = (props: {
    category: Category
    onDelete?: (id: number) => void
}) => {
    const submit = useSubmit()

    return (
        <div className="flex gap-0.5 items-center">
            <Badge>{props.category.name}</Badge>
            <XCircle
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                    props.onDelete?.(props.category.id)
                    submit(
                        { id: props.category.id, intent: 'category' },
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

export { CategoryPart }
