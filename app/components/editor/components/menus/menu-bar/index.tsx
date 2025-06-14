import { Editor } from '@tiptap/react'

import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'

import {
	editAlignOptions,
	editHistoryOptions,
	editListOptions,
	editMarkOptions,
	editMiscOptions,
	editParagraphOptions,
	ImageButton,
	LinkUnlinkButtons,
	YoutubeButton,
} from '../../../edit-options'
import { ToggleButton } from '../../toggle-button'

export const MenuBar = ({
	editor,
	className,
}: {
	editor: Editor
	className?: string
}) => {
	return (
		<div
			id="menu-bar"
			className={cn(
				'py-1.5 border border-muted-foreground rounded-lg',
				className,
			)}
		>
			<div id="buttons" className="flex flex-wrap items-center gap-1 p-1">
				{/* Formatting */}
				{editMarkOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator orientation="vertical" className="h-full min-h-[1.5rem]" />

				{/* Paragraph */}
				{editParagraphOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator orientation="vertical" className="h-full min-h-[1.5rem]" />

				{/* List */}
				{editListOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator orientation="vertical" className="h-full min-h-[1.5rem]" />

				{/* Align */}
				{editAlignOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator orientation="vertical" className="h-full min-h-[1.5rem]" />

				{/* Misc */}
				{editMiscOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator orientation="vertical" className="h-full min-h-[1.5rem]" />

				{/* Undo/Redo */}
				{editHistoryOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator orientation="vertical" className="h-full min-h-[1.5rem]" />

				{/* Resource */}
				<LinkUnlinkButtons editor={editor} />
				<ImageButton editor={editor} />
				<YoutubeButton editor={editor} />
			</div>
		</div>
	)
}
