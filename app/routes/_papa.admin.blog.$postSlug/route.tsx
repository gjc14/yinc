import { Form, Link, useFetcher, useParams } from '@remix-run/react'
import { ExternalLink, Loader2, Save, Trash } from 'lucide-react'
import { useMemo, useState } from 'react'

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
import { useAdminBlogContext } from '~/routes/_papa.admin.blog/route'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'

export default function AdminPost() {
    const fetcher = useFetcher()
    const params = useParams()
    const postSlug = params.postSlug
    const { posts, tags, categories } = useAdminBlogContext()
    const post = posts.find(p => p.slug === postSlug)

    if (!post) {
        return (
            <h2 className="grow flex items-center justify-center">Not found</h2>
        )
    }

    const [isDirty, setIsDirty] = useState(false)

    const postContent = useMemo(() => {
        return {
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
        }
    }, [post])

    const isSubmitting = fetcher.state === 'submitting'

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle
                    title="Edit Post"
                    description={'Post id: ' + post.id}
                ></AdminTitle>
                <AdminActions>
                    <Link
                        to={`/blog/${post.slug}?preview=true`}
                        target="_blank"
                    >
                        <Button variant={'link'}>
                            {postContent.status !== 'PUBLISHED'
                                ? 'Preview'
                                : 'See'}{' '}
                            post
                            <ExternalLink size={12} />
                        </Button>
                    </Link>
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
                                    Are you sure you want to discard this post
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Link to="/admin/blog">
                                    <AlertDialogAction
                                        onClick={() => {
                                            window.localStorage.removeItem(
                                                `dirty-post-${postContent.id}`
                                            )
                                        }}
                                    >
                                        Discard
                                    </AlertDialogAction>
                                </Link>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button type="submit" form="update-post" size={'sm'}>
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        <p className="text-xs">Save</p>
                    </Button>
                </AdminActions>
            </AdminHeader>

            <Form
                id="update-post"
                onSubmit={e => {
                    e.preventDefault()
                    fetcher.submit(e.currentTarget, { method: 'PUT' })
                    setIsDirty(false)
                }}
            >
                <input hidden name="id" defaultValue={post.id} />
                {/* <PostContent
                    post={postContent}
                    tags={tags}
                    categories={categories}
                    onPostChange={(_, dirty) => setIsDirty(dirty)}
                /> */}
            </Form>
        </AdminSectionWrapper>
    )
}
