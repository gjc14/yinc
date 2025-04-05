/**
 * Danger zone for post editer
 */

import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { PostWithRelations } from '~/lib/db/post.server'

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

            <div className="w-full flex flex-col p-3 bg-destructive/70 border rounded-lg space-y-3">
                <h4>⚠️ Danger Zone</h4>
                <div className="flex items-center justify-between border rounded-md py-1 px-2 bg-muted/60">
                    <div className="flex flex-col gap-0.5">
                        <p>Delete this post</p>
                        <p className="text-destructive-foreground/60">
                            This action cannot be undone.
                        </p>
                    </div>
                    <Button onClick={onDeleteRequest}>Delete Post</Button>
                </div>
            </div>
        </>
    )
}
