import { z } from 'zod'

export const UserRole = z.enum(['ADMIN', 'AUTHOR', 'EDITOR', 'SUBSCRIBER'])
export type UserRole = z.infer<typeof UserRole>

export const UserStatus = z.enum([
    'VIP',
    'ACTIVE',
    'INACTIVE',
    'BLOCKED',
    'SUSPENDED',
])
export type UserStatus = z.infer<typeof UserStatus>

export const PostStatus = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'TRASHED'])
export type PostStatus = z.infer<typeof PostStatus>
