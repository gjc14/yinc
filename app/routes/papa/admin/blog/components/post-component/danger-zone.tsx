/**
 * Danger zone for post editer
 */

import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import type { PostWithRelations } from '~/lib/db/post.server'

export const DangerZone = ({
	postState,
	onDeleteRequest,
}: {
	postState: PostWithRelations
	onDeleteRequest: () => void
}) => {
	if (postState.id === -1) {
		return null
	}

	return (
		<>
			<Separator />

			<div className="w-full flex flex-col p-3 border rounded-lg space-y-3">
				<h4>⚠️ Danger Zone</h4>
				<div className="flex items-center justify-between border rounded-md py-1 px-2">
					<div className="flex flex-col gap-0.5">
						<strong className="text-lg">Delete this post</strong>
						<p className="">This action cannot be undone.</p>
					</div>
					<Button onClick={onDeleteRequest} variant={'destructive'}>
						Delete Post
					</Button>
				</div>
			</div>
		</>
	)
}
