import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import DefaultTipTap, { EditorRef } from '~/components/editor/default-tiptap'
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
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import { PostWithRelations } from '~/lib/db/post.server'
import { Category, PostStatus, Tag } from '~/lib/db/schema'
import { generateSeoDescription, generateSlug } from '~/lib/utils/seo'

interface PostContentProps {
    post: PostWithRelations
    tags: Tag[]
    categories: Category[]
}

// TODO: Add featured image; edit author; publish schedule
// TODO: Editor upload image; link setting popup
export const PostContent = ({ post, tags, categories }: PostContentProps) => {
    const editorRef = useRef<EditorRef | null>(null)
    const contentWrapperRef = useRef<HTMLDivElement>(null)

    const [openRecoverAlert, setOpenRecoverAlert] = useState(false) // AlertDialog
    const [initRecoverUnsaved, setInitRecoverUnsaved] = useState(false)
    const [postState, setPostState] = useState<PostWithRelations>(post)

    const postLocalStorageKey = `dirty-post-${postState.id}`

    const removeLocalStorageContent = () => {
        if (!window) return
        window.localStorage.removeItem(postLocalStorageKey)
        setInitRecoverUnsaved(true)
    }

    const recoverLocalStorageContent = () => {
        if (!window) return
        const postContentLocal = JSON.parse(
            window.localStorage.getItem(postLocalStorageKey) || '{}'
        )
        setPostState(postContentLocal)
        editorRef.current?.updateContent(postContentLocal.content)
        setInitRecoverUnsaved(true)
    }

    // Initialize recover/discard unsaved changes
    // 1. Recover 2. Discard 3. Nothing => setInitRecoverUnsaved(true)
    useEffect(() => {
        if (window) {
            const dirtyPost = window.localStorage.getItem(postLocalStorageKey)

            if (dirtyPost) {
                const isDirty = dirtyPost !== JSON.stringify(postState)

                if (isDirty) {
                    setOpenRecoverAlert(true)
                } else {
                    setInitRecoverUnsaved(true)
                    window.localStorage.removeItem(postLocalStorageKey)
                }
            } else {
                setInitRecoverUnsaved(true)
            }
        }
    }, [])

    // Update parent component and save dirty to local when post content changes
    useEffect(() => {
        const postChanged = JSON.stringify(postState)
        const isDirty = postChanged !== JSON.stringify(post)
        // TODO: Didnt remove if it redirect from new page
        if (isDirty && window) {
            window.localStorage.setItem(postLocalStorageKey, postChanged)
        } else if (!isDirty && window && initRecoverUnsaved) {
            // Remove only if user has asked to recover unsaved changes (prevent removed on render)
            window.localStorage.removeItem(postLocalStorageKey)
        }
    }, [postState])

    return (
        <div className="w-full flex flex-col md:flex-row gap-5">
            <AlertDialog
                open={openRecoverAlert}
                onOpenChange={setOpenRecoverAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Unsaved changes detected
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to recover your unsaved changes? For
                            post <strong>{postState.title}</strong> (id:{' '}
                            {postState.id})
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={removeLocalStorageContent}>
                            Discard
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={recoverLocalStorageContent}>
                            Recover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <section
                className={`w-[calc(65ch+1.5rem)] flex flex-col gap-5 shrink-0`}
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
                                setPostState(prev => {
                                    const newPost = {
                                        ...prev,
                                        content: toJSON(),
                                    }
                                    return newPost
                                })
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

            <section className="grow flex flex-col gap-5">
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={postState.status}
                        name="status"
                        onValueChange={v => {
                            setPostState(prev => {
                                const newPost = {
                                    ...prev,
                                    status: v,
                                }
                                return newPost
                            })
                        }}
                    >
                        <SelectTrigger id="status" className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {PostStatus.map(status => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="slug">Slug</Label>
                    <div className="flex items-center gap-1.5">
                        <Input
                            id="slug"
                            name="slug"
                            type="text"
                            placeholder="How to display your post in the URL?"
                            value={postState.slug}
                            onChange={e => {
                                setPostState(prev => {
                                    const newPost = {
                                        ...prev,
                                        slug: e.target.value,
                                    }
                                    return newPost
                                })
                            }}
                        />
                        <Button
                            type="button"
                            variant={'secondary'}
                            onClick={() => {
                                const slug = generateSlug(postState.title)

                                setPostState(prev => {
                                    const newPost = {
                                        ...prev,
                                        slug,
                                    }
                                    return newPost
                                })
                            }}
                        >
                            Generate
                        </Button>
                    </div>
                </div>

                <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        rows={3}
                        placeholder="Short description about your post..."
                        value={postState.excerpt || ''}
                        onChange={e => {
                            setPostState(prev => {
                                const newPost = {
                                    ...prev,
                                    excerpt: e.target.value,
                                }
                                return newPost
                            })
                        }}
                    />
                    <Button
                        type="button"
                        variant={'secondary'}
                        className="mt-2"
                        onClick={() => {
                            setPostState(prev => {
                                const text = editorRef.current?.getText() || ''
                                if (!text) {
                                    toast.error(
                                        'No content to generate excerpt'
                                    )
                                    return prev
                                }
                                const newPost = {
                                    ...prev,
                                    excerpt: generateSeoDescription(text),
                                }
                                return newPost
                            })
                        }}
                    >
                        Generate Excerpt
                    </Button>
                </div>

                <Separator />

                <div>
                    <Label htmlFor="categories">Categories</Label>
                    <div className="flex items-center gap-1.5">
                        Select Categories
                    </div>
                </div>

                <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex items-center gap-1.5">Select Tags</div>
                </div>

                <Separator />

                <div>
                    <Label htmlFor="seo-title">SEO Title</Label>
                    <div className="flex items-center gap-1.5">
                        <Input
                            id="seo-title"
                            name="seo-title"
                            type="text"
                            placeholder="Meta tilte should match Title (H1) for SEO."
                            value={postState.seo.metaTitle ?? ''}
                            onChange={e => {
                                setPostState(prev => {
                                    const newPost = {
                                        ...prev,
                                        seo: {
                                            ...prev.seo,
                                            metaTitle: e.target.value,
                                        },
                                    } satisfies PostWithRelations
                                    return newPost
                                })
                            }}
                        />
                        <Button
                            type="button"
                            variant={'secondary'}
                            onClick={() => {
                                setPostState(prev => {
                                    const newPost = {
                                        ...prev,
                                        seo: {
                                            ...prev.seo,
                                            metaTitle: postState.title,
                                        },
                                    } satisfies PostWithRelations
                                    return newPost
                                })
                            }}
                        >
                            Copy Title
                        </Button>
                    </div>
                </div>

                <div>
                    <Label htmlFor="seo-description">SEO Description</Label>
                    <Textarea
                        id="seo-description"
                        name="seo-description"
                        rows={3}
                        placeholder="Short description about your post..."
                        value={postState.seo.metaDescription ?? ''}
                        onChange={e => {
                            setPostState(prev => {
                                const newPost = {
                                    ...prev,
                                    seo: {
                                        ...prev.seo,
                                        metaDescription: e.target.value,
                                    },
                                } satisfies PostWithRelations
                                return newPost
                            })
                        }}
                    />
                    <Button
                        type="button"
                        variant={'secondary'}
                        className="mt-2"
                        onClick={() => {
                            setPostState(prev => {
                                const text = editorRef.current?.getText() || ''
                                if (!text) {
                                    toast.error(
                                        'No content to generate SEO description'
                                    )
                                    return prev
                                }
                                const newPost = {
                                    ...prev,
                                    seo: {
                                        ...prev.seo,
                                        metaDescription:
                                            generateSeoDescription(text),
                                    },
                                } satisfies PostWithRelations
                                return newPost
                            })
                        }}
                    >
                        Generate SEO Description
                    </Button>
                </div>
            </section>
        </div>
    )
}
