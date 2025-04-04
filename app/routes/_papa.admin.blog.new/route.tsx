import { Form, Link, useFetcher } from '@remix-run/react'
import { Loader2, PlusCircle, Trash } from 'lucide-react'
import { useRef, useState } from 'react'

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
import { PostStatus, User } from '~/lib/db/schema'
import { ConventionalActionResponse } from '~/lib/utils'
import {
    PostContent,
    PostContentHandle,
} from '~/routes/_papa.admin.blog.$postSlug/post-content'
import { useAdminBlogContext } from '~/routes/_papa.admin.blog/route'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'

export default function AdminPost() {
    const fetcher = useFetcher<ConventionalActionResponse<PostWithRelations>>()
    const { tags, categories, admin } = useAdminBlogContext()
    const postContentRef = useRef<PostContentHandle>(null)
    const [isDirty, setIsDirty] = useState(false)

    const isSubmitting = fetcher.state === 'submitting'

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle title="New Post"></AdminTitle>
                <AdminActions>
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
                                    Are you sure you want to discard this post?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Link to="/admin/blog">
                                    <AlertDialogAction
                                        onClick={() => {
                                            window.localStorage.removeItem(
                                                `dirty-post-${-1}`
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
                                method: 'POST', // Create
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
                            <PlusCircle size={16} />
                        )}
                        <p className="text-xs">Create</p>
                    </Button>
                </AdminActions>
            </AdminHeader>

            <PostContent
                ref={postContentRef}
                post={generateNewPost(admin)}
                tags={tags}
                categories={categories}
                onDirtyChange={isDirty => setIsDirty(isDirty)}
            />
        </AdminSectionWrapper>
    )
}

const generateNewPost = (user: User): PostWithRelations => {
    const now = new Date()
    return {
        id: -1,
        createdAt: now,
        updatedAt: now,
        title: '',
        slug: '',
        content: null,
        excerpt: null,
        featuredImage: null,
        status: PostStatus[0],
        authorId: user.id,
        author: user,
        tags: [],
        categories: [],
        seo: {
            id: -1,
            createdAt: now,
            updatedAt: now,
            metaTitle: null,
            metaDescription: null,
            keywords: null,
            ogImage: null,
            autoGenerated: true,
            route: null,
            postId: null,
        },
    }
}
