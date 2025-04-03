import { Form, Link, useFetcher } from '@remix-run/react'
import { Loader2, PlusCircle, Trash } from 'lucide-react'
import { useState } from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { generateSlug } from '~/lib/utils'
import { PostContentEdit } from '~/routes/_papa.admin.blog.$postSlug/post-content'
import { useAdminBlogContext } from '~/routes/_papa.admin.blog/route'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'

export default function AdminPost() {
    const fetcher = useFetcher()
    const { tags, categories } = useAdminBlogContext()
    const [isDirty, setIsDirty] = useState(false)
    const isSubmitting = fetcher.state === 'submitting'

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle title="New Post"></AdminTitle>
                <AdminActions>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size={'sm'} variant={'destructive'}>
                                <Trash height={16} width={16} />
                                <p className="text-xs">Discard</p>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Discard Post
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to discard this post?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Link to="/admin/blog">
                                    <AlertDialogAction
                                        onClick={() => {
                                            window.localStorage.removeItem(
                                                `dirty-post-new`
                                            )
                                        }}
                                    >
                                        Discard
                                    </AlertDialogAction>
                                </Link>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button type="submit" form="new-post" size={'sm'}>
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <PlusCircle size={16} />
                        )}
                        <p className="text-xs">Save</p>
                    </Button>
                </AdminActions>
            </AdminHeader>

            <Form
                id="new-post"
                onSubmit={e => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)

                    let title = formData.get(
                        'title'
                    ) as PostContentEdit['title']
                    let slug = formData.get('slug') as PostContentEdit['slug']

                    if (!title) {
                        title = `new-post-${new Date()
                            .getTime()
                            .toString()
                            .slice(-5)}`
                        formData.set('title', title)
                    }
                    if (!slug) {
                        slug = generateSlug(title)
                        formData.set('slug', slug)
                    }

                    fetcher.submit(formData, { method: 'POST' })
                    setIsDirty(false)
                }}
            >
                {/* <PostContent
                    post={newPost}
                    tags={tags}
                    categories={categories}
                    onPostChange={(_, dirty) => setIsDirty(dirty)}
                /> */}
            </Form>
        </AdminSectionWrapper>
    )
}
