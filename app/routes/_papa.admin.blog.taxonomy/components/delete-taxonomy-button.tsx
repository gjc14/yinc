import { useFetcher } from '@remix-run/react'

import { Button } from '~/components/ui/button'
import { Intents } from '~/routes/_papa.admin.blog.taxonomy.resource/route'
import { useTaxonomyState } from '../context'

export function DeleteTaxonomyButton({
    id,
    actionRoute,
    intent,
}: {
    id: number
    actionRoute: string
    intent: Intents
}) {
    const { setTagsState, setCategoriesState } = useTaxonomyState()
    const fetcher = useFetcher()
    const isDeleting = Number(fetcher.formData?.get('id')) === id

    const handleDelete = () => {
        switch (intent) {
            case 'tag':
                setTagsState(tags => tags.filter(tag => tag.id !== id))
                break
            case 'category':
                setCategoriesState(categories =>
                    categories.filter(category => category.id !== id)
                )
                break
        }
    }

    return (
        <Button
            type="submit"
            size={'sm'}
            variant={'destructive'}
            className="ml-auto"
            disabled={isDeleting}
            onClick={() => {
                handleDelete()
                fetcher.submit(
                    {
                        id: id,
                        intent: intent,
                    },
                    {
                        method: 'DELETE',
                        action: actionRoute,
                    }
                )
            }}
        >
            Delete
        </Button>
    )
}
