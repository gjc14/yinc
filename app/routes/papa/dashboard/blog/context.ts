import { Editor } from '@tiptap/core'
import { atom } from 'jotai'

import type { PostWithRelations } from '~/lib/db/post.server'
import type { Category, Tag } from '~/lib/db/schema'

export const postAtom = atom<PostWithRelations>()
export const tagsAtom = atom<Tag[]>([])
export const categoriesAtom = atom<Category[]>([])
export const editorAtom = atom<Editor | null>(null)

export const isSettingsOpenAtom = atom(false)

export const isDirtyAtom = atom(false)

export const isRestoreAlertOpenAtom = atom(false)
export const isResetAlertOpenAtom = atom(false)
export const isDeleteAlertOpenAtom = atom(false)

export const isSavingAtom = atom(false)
export const isDeletingAtom = atom(false)
