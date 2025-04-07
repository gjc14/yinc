import { useFetcher, useNavigate } from 'react-router'
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'

import DefaultTipTap, {
    type EditorRef,
} from '~/components/editor/default-tiptap'
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
} from '~/components/ui/alert-dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import type { PostWithRelations } from '~/lib/db/post.server'
import type { Category, Tag } from '~/lib/db/schema'
import { type ConventionalActionResponse } from '~/lib/utils'
import { useDebounce } from '~/lib/utils/debounce'
import { areDifferentPosts } from '../../utils'
import { DangerZone } from './danger-zone'
import { PostMetaPart } from './post-meta-part'
import { SeoPart } from './seo-part'
import { TaxonomyPart } from './taxonomy-part'

interface PostContentProps {
    post: PostWithRelations
    tags: Tag[]
    categories: Category[]
    onDirtyChange: (isDirty: boolean) => void
}

export interface PostContentHandle {
    getPostState: () => PostWithRelations
}

// TODO: Add featured image; edit author; publish schedule
// TODO: Editor upload image; link setting popup
export const PostContent = forwardRef<PostContentHandle, PostContentProps>(
    ({ post, tags, categories, onDirtyChange }, ref) => {
        const fetcher = useFetcher<ConventionalActionResponse>()
        const navigate = useNavigate()

        const editorRef = useRef<EditorRef | null>(null)
        const contentWrapperRef = useRef<HTMLDivElement>(null)
        const isDirtyPostInitialized = useRef(false)

        const [openAlert, setOpenAlert] = useState(false) // AlertDialog
        const [postState, setPostState] = useState<PostWithRelations>(post)
        const [isDirty, setIsDirty] = useState(false)

        const postLocalStorageKey = `dirty-post-${postState.id}`

        const removeLocalStorageContent = () => {
            if (!window) return
            window.localStorage.removeItem(postLocalStorageKey)

            isDirtyPostInitialized.current = true
        }

        const recoverLocalStorageContent = () => {
            if (!window) return
            const postContentLocal = JSON.parse(
                window.localStorage.getItem(postLocalStorageKey) || '{}'
            )
            setPostState(postContentLocal)
            editorRef.current?.updateContent(postContentLocal.content)

            isDirtyPostInitialized.current = true
        }

        const debouncedContentUpdate = useDebounce(
            (content: string) => {
                setPostState(prev => ({
                    ...prev,
                    content,
                }))
            },
            500,
            []
        )

        const debouncedLocalStorageUpdate = useDebounce(
            (post: PostWithRelations) => {
                if (!window) return
                window.localStorage.setItem(
                    postLocalStorageKey,
                    JSON.stringify(post)
                )
            },
            500,
            []
        )

        const isDeleting = fetcher.state !== 'idle'

        const handleDelete = () => {
            fetcher.submit(
                {
                    id: postState.id,
                },
                {
                    method: 'DELETE',
                    action: '/admin/blog/resource',
                    encType: 'application/json',
                }
            )
        }

        // Initialize recover/discard unsaved changes
        // If not dirty initialized, if dirty initialized after recover/discard
        useEffect(() => {
            if (window) {
                const dirtyPost =
                    window.localStorage.getItem(postLocalStorageKey)

                if (dirtyPost) {
                    if (areDifferentPosts(postState, JSON.parse(dirtyPost))) {
                        setOpenAlert(true)
                    }
                } else {
                    isDirtyPostInitialized.current = true
                }
            }
        }, [])

        useEffect(() => {
            // Every time post loaded, check current edit state with post loaded
            const diff = areDifferentPosts(postState, post)
            if (diff) {
                onDirtyChange(true)
                setIsDirty(true)
            } else {
                onDirtyChange(false)
                setIsDirty(false)
            }
        }, [post])

        // Save dirty to local when post content changes
        useEffect(() => {
            if (!window) return
            if (!isDirtyPostInitialized.current) return

            const diff = areDifferentPosts(postState, post)
            if (diff) {
                if (!isDirty) {
                    onDirtyChange(true)
                    setIsDirty(true)
                }
                debouncedLocalStorageUpdate(postState)
            } else {
                if (isDirty) {
                    onDirtyChange(false)
                    setIsDirty(false)
                }
                window.localStorage.removeItem(postLocalStorageKey)
            }
        }, [postState])

        useEffect(() => {
            if (fetcher.state === 'loading' && fetcher.data) {
                const { err } = fetcher.data
                if (!err) {
                    navigate('/admin/blog')
                }
            }
        }, [fetcher])

        useImperativeHandle(ref, () => ({
            getPostState: () => postState,
        }))

        return (
            <div
                className={`w-full flex flex-wrap justify-center gap-5 ${
                    isDeleting ? ' overflow-hidden' : ''
                }`}
            >
                {isDeleting && <FullScreenLoading contained />}
                <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {isDirtyPostInitialized.current
                                    ? 'Are you absolutely sure?'
                                    : 'Unsaved changes detected'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {isDirtyPostInitialized.current ? (
                                    <>
                                        This action cannot be undone. This will
                                        permanently delete{' '}
                                        <span className="font-bold text-primary">
                                            {postState.title}
                                        </span>{' '}
                                        (id: {postState.id}).
                                    </>
                                ) : (
                                    <>
                                        Do you want to recover your unsaved
                                        changes? For post{' '}
                                        <strong>{postState.title}</strong> (id:{' '}
                                        {postState.id})
                                    </>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() =>
                                    isDirtyPostInitialized.current
                                        ? setOpenAlert(false)
                                        : removeLocalStorageContent()
                                }
                            >
                                {isDirtyPostInitialized.current
                                    ? 'Cancel'
                                    : 'Discard'}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    isDirtyPostInitialized.current
                                        ? handleDelete()
                                        : recoverLocalStorageContent()
                                }
                            >
                                {isDirtyPostInitialized.current
                                    ? 'Delete permanently'
                                    : 'Recover'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <section
                    className={`w-full max-w-[calc(65ch+1.5rem)] flex flex-col gap-5 shrink-0`}
                >
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="What is your post title?"
                            value={postState.title}
                            onChange={e => {
                                setPostState(prev => {
                                    const newPost = {
                                        ...prev,
                                        title: e.target.value,
                                    }
                                    return newPost
                                })
                            }}
                        />
                    </div>

                    <div>
                        <Label htmlFor="content">Content</Label>
                        <div
                            ref={contentWrapperRef}
                            className="p-3 border border-border rounded-md"
                        >
                            <DefaultTipTap
                                ref={editorRef}
                                content={postState.content || undefined}
                                onUpdate={({ toJSON }) => {
                                    debouncedContentUpdate(toJSON())
                                }}
                                onFocus={() => {
                                    contentWrapperRef.current?.classList.add(
                                        'border-primary'
                                    )
                                }}
                                onBlur={() => {
                                    contentWrapperRef.current?.classList.remove(
                                        'border-primary'
                                    )
                                }}
                            />
                        </div>
                    </div>
                </section>

                <section className="w-min max-w-[calc(65ch+1.5rem)] grow flex flex-col gap-5 mb-12">
                    <PostMetaPart
                        postState={postState}
                        setPostState={setPostState}
                        editorRef={editorRef}
                    />

                    <Separator />

                    <TaxonomyPart
                        postState={postState}
                        setPostState={setPostState}
                        tags={tags}
                        categories={categories}
                    />

                    <Separator />

                    <SeoPart
                        postState={postState}
                        setPostState={setPostState}
                        editorRef={editorRef}
                    />

                    <DangerZone
                        postState={postState}
                        onDeleteRequest={() => setOpenAlert(true)}
                    />
                </section>
            </div>
        )
    }
)
