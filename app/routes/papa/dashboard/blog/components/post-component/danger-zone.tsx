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

			<div className="flex w-full flex-col space-y-3 rounded-lg border p-3">
				<h4>⚠️ Danger Zone</h4>
				<div className="flex items-center justify-between rounded-md border px-2 py-1">
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
