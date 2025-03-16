import { Tag } from '@prisma/client'
import { useSubmit } from '@remix-run/react'
import { ObjectId } from 'bson'
import { XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { TagsFromDB } from '~/lib/db/blog-taxonomy.server'
import { actionRoute } from '.'

const TagPart = (props: {
    tags: TagsFromDB
    onDelete: (id: string) => void
}) => {
    const submit = useSubmit()
    const { tags, onDelete } = props

    const [tagValue, setTagValue] = useState<string>('')
    const [isComposing, setIsComposing] = useState(false)

    const addTag = (tag: string) => {
        submit(
            { id: String(new ObjectId()), name: tag.trim(), intent: 'tag' },
            { method: 'POST', action: actionRoute, navigate: false }
        )
        setTagValue('')
    }

    // Check enterd value
    useEffect(() => {
        if (
            tagValue &&
            (tagValue[tagValue.length - 1] === ';' ||
                tagValue[tagValue.length - 1] === ',')
        ) {
            addTag(tagValue.split(tagValue[tagValue.length - 1])[0])
        }
    }, [tagValue])

    return (
        <div className="grid gap-1.5">
            <Label htmlFor="tag" className="flex items-center gap-x-1.5">
                Tag
            </Label>
            <Input
                id="tag"
                name="tag"
                type="text"
                value={tagValue}
                placeholder="Tag name"
                onChange={e => setTagValue(e.target.value)}
                onKeyDown={e => {
                    ;(e.key === 'Enter' || e.key === 'Tab') &&
                        !isComposing &&
                        addTag(tagValue)
                }}
                onCompositionStart={() => {
                    setIsComposing(true)
                }}
                onCompositionEnd={() => {
                    setIsComposing(false)
                }}
            />
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                    {tags.map(tag => (
                        <TagItem
                            key={tag.id}
                            tag={tag}
                            onDelete={id => onDelete(id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const TagItem = (props: { tag: Tag; onDelete?: (id: string) => void }) => {
    const submit = useSubmit()

    return (
        <div className="flex gap-0.5 items-center">
            <Badge>{props.tag.name}</Badge>
            <XCircle
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                    props.onDelete?.(props.tag.id)
                    submit(
                        { id: props.tag.id, intent: 'tag' },
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

export { TagPart }
