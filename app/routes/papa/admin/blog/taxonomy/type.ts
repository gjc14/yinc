import type { PostWithRelations } from '~/lib/db/post.server'
import { useAdminBlogContext } from '~/routes/papa/admin/blog/layout'

export type TagType = ReturnType<typeof useAdminBlogContext>['tags'][number] & {
	posts: PostWithRelations[]
}
export type CategoryType = ReturnType<
	typeof useAdminBlogContext
>['categories'][number] & { posts: PostWithRelations[] }
