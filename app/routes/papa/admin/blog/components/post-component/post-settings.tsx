import { Separator } from '~/components/ui/separator'
import { type EditorRef } from '~/components/editor'
import type { PostWithRelations } from '~/lib/db/post.server'
import type { Category, Tag } from '~/lib/db/schema'

import { DangerZone } from './danger-zone'
import { PostMetaPart } from './post-meta-part'
import { SeoPart } from './seo-part'
import { TaxonomyPart } from './taxonomy-part'

export const PostSettings = ({
	postState,
	setPostState,
	tags,
	categories,
	editorRef,
	onDeleteRequest,
}: {
	postState: PostWithRelations
	setPostState: React.Dispatch<React.SetStateAction<PostWithRelations>>
	tags: Tag[]
	categories: Category[]
	editorRef: React.RefObject<EditorRef>
	onDeleteRequest: () => void
}) => {
	return (
		<section className="w-full grow flex flex-col gap-5 my-12">
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

			<DangerZone postState={postState} onDeleteRequest={onDeleteRequest} />
		</section>
	)
}
