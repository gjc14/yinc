import { useEditorState } from '@tiptap/react'
import { useAtom } from 'jotai'
import { MoreVertical } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

import { editorAtom } from '../../context'
import { TooltipWrapper } from '../components/tooltip-wrapper'
import { type EditOptionProps } from '../edit-options'

export function MoreDropdownMenu({ options }: { options: EditOptionProps[] }) {
	const [editor] = useAtom(editorAtom)

	/**
	 * The selector function allows you to specify which parts of the editor state you want to subscribe to.
	 * @see https://tiptap.dev/docs/guides/performance#use-useeditorstate-to-prevent-unnecessary-re-renders
	 */
	useEditorState({
		editor,
		selector: ctx => {
			const { editor } = ctx
			if (!editor) return

			return editor.can()
		},
	})

	if (!editor) return null

	return (
		<DropdownMenu>
			<TooltipWrapper tooltip="More options">
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size={'sm'}
						className="cursor-pointer"
						onClick={e => e.isDefaultPrevented()}
					>
						<MoreVertical />
					</Button>
				</DropdownMenuTrigger>
			</TooltipWrapper>
			<DropdownMenuContent className="bg-background">
				{options.map(
					({ name, shortcut, icon: Icon, run, canRun, isActive }, index) => (
						<TooltipWrapper
							key={index}
							tooltip={name}
							shortcut={shortcut}
							side="right"
						>
							<DropdownMenuItem asChild>
								<Button
									variant="ghost"
									size={'sm'}
									disabled={!canRun(editor)}
									onClick={() => run(editor)}
									className={`w-full cursor-pointer justify-start ${isActive?.(editor) ? 'bg-accent' : ''}`}
								>
									<Icon className="size-4" />
									{name}
								</Button>
							</DropdownMenuItem>
						</TooltipWrapper>
					),
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
