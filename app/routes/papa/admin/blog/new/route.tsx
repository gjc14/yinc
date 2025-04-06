import { Link, useFetcher, useNavigate, useNavigation } from '@remix-run/react'
import { Loader2, PlusCircle, Trash } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FullScreenLoading } from '~/components/loading'

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
import { generateSlug } from '~/lib/utils/seo'
import { PostContent, PostContentHandle } from '../components/post-content'
import { useAdminBlogContext } from '~/routes/papa/admin/blog/layout'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/papa/admin/components/admin-wrapper'

export default function AdminNewPost() {
    const fetcher = useFetcher<ConventionalActionResponse<{ slug: string }>>()
    const navigate = useNavigate()
    const navigation = useNavigation()

    const { tags, categories, admin } = useAdminBlogContext()

    const postContentRef = useRef<PostContentHandle>(null)
    const [isDirty, setIsDirty] = useState(false)

    const post = useMemo(() => generateNewPost(admin), [admin])

    const isSubmitting = fetcher.state === 'submitting'
    const isNavigating = navigation.state === 'loading'

    useEffect(() => {
        if (fetcher.state === 'loading' && fetcher.data) {
            const { err, data } = fetcher.data
            if (!err) {
                navigate(`/admin/blog/${data?.slug}`)
            } else {
                console.error('Error creating post:', err)
            }
        }
    }, [fetcher])

    return (
        <AdminSectionWrapper
            className={`${isNavigating ? 'overflow-hidden' : ''}`}
        >
            {isNavigating && <FullScreenLoading contained />}
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

                            const date = new Date()
                            const now = `${date.getFullYear()}/${String(
                                date.getMonth() + 1
                            ).padStart(2, '0')}/${String(
                                date.getDate()
                            ).padStart(2, '0')}@${String(
                                date.getHours()
                            ).padStart(2, '0')}:${String(
                                date.getMinutes()
                            ).padStart(2, '0')}:${String(
                                date.getSeconds()
                            ).padStart(2, '0')}`
                            // Remove date fields and set default values
                            const postReady = {
                                ...postState,
                                title: postState.title || `Post-${now}`,
                                slug:
                                    postState.slug ||
                                    generateSlug(
                                        postState.title || `Post-${now}`
                                    ),
                                createdAt: undefined,
                                updatedAt: undefined,
                                seo: {
                                    ...postState.seo,
                                    createdAt: undefined,
                                    updatedAt: undefined,
                                },
                            }

                            fetcher.submit(JSON.stringify(postReady), {
                                method: 'POST', // Create
                                encType: 'application/json',
                                action: '/admin/blog/resource',
                            })

                            setIsDirty(false)
                            window.localStorage.removeItem(`dirty-post-${-1}`)
                        }}
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <PlusCircle size={16} />
                        )}
                        <p className="text-xs">
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </p>
                    </Button>
                </AdminActions>
            </AdminHeader>

            <PostContent
                ref={postContentRef}
                post={post}
                tags={tags}
                categories={categories.map(c => {
                    const { subCategories, ...categoryWithoutSub } = c
                    return categoryWithoutSub
                })}
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
