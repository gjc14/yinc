import { Link, useFetcher, useParams } from '@remix-run/react'
import { ExternalLink, Loader2, Save, Trash } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
import { PostWithRelations } from '~/lib/db/post.server'
import { ConventionalActionResponse } from '~/lib/utils'
import { useAdminBlogContext } from '~/routes/_papa.admin.blog/route'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import { PostContent, PostContentHandle } from './post-content'

export default function AdminPost() {
    const fetcher = useFetcher<ConventionalActionResponse<PostWithRelations>>()
    const params = useParams()
    const { posts, tags, categories } = useAdminBlogContext()
    const postContentRef = useRef<PostContentHandle>(null)
    const [isDirty, setIsDirty] = useState(false)

    const postSlug = params.postSlug
    const post = posts.find(p => p.slug === postSlug)

    if (!post) {
        return (
            <h2 className="grow flex items-center justify-center">Not found</h2>
        )
    }

    const isSubmitting = fetcher.state === 'submitting'

    useEffect(() => {}, [fetcher])

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle
                    title="Edit Post"
                    description={'Post id: ' + post.id}
                ></AdminTitle>
                <AdminActions>
                    {post.status !== 'PUBLISHED' ? (
                        !isDirty ? (
                            <Link
                                to={`/blog/${post.slug}?preview=true`}
                                target="_blank"
                            >
                                <Button variant={'link'}>
                                    Preview post
                                    <ExternalLink size={12} />
                                </Button>
                            </Link>
                        ) : (
                            <Button variant={'link'} disabled>
                                Preview post
                                <ExternalLink size={12} />
                            </Button>
                        )
                    ) : (
                        <Link to={`/blog/${post.slug}`} target="_blank">
                            <Button variant={'link'}>
                                See post
                                <ExternalLink size={12} />
                            </Button>
                        </Link>
                    )}
                    <AlertDialog>
                        {isDirty && (
                            <AlertDialogTrigger asChild>
                                <Button size={'sm'} variant={'destructive'}>
                                    <Trash height={16} width={16} />
                                    <p className="text-xs">Discard</p>
                                </Button>
                            </AlertDialogTrigger>
                        )}
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
                                                `dirty-post-${post.id}`
                                            )
                                        }}
                                        className="w-full"
                                    >
                                        Discard
                                    </AlertDialogAction>
                                </Link>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button
                        type="submit"
                        size={'sm'}
                        disabled={!isDirty}
                        onClick={() => {
                            const postState =
                                postContentRef.current?.getPostState()
                            if (!postState) return

                            fetcher.submit(JSON.stringify(postState), {
                                method: 'PUT', // Update
                                encType: 'application/json',
                                action: '/admin/blog',
                            })

                            // TODO: Handle form submission
                            // setIsDirty(false)
                            // window.localStorage.removeItem(`dirty-post-${post.id}`)
                        }}
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        <p className="text-xs">Save</p>
                    </Button>
                </AdminActions>
            </AdminHeader>

            <PostContent
                ref={postContentRef}
                post={post}
                tags={tags}
                categories={categories}
                onDirtyChange={isDirty => setIsDirty(isDirty)}
            />
        </AdminSectionWrapper>
    )
}
