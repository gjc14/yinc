import { Editor } from '@tiptap/react'
import { ChevronDown } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'
import { type EditOptionProps } from '~/components/editor/edit-options'

type OptionTypes = EditOptionProps | { label: string }

const isLabel = (option: OptionTypes): option is { label: string } => {
	return (option as { label: string }).label !== undefined
}
const isOption = (option: OptionTypes): option is EditOptionProps => {
	return (option as EditOptionProps).icon !== undefined
}

export const PopoverMenuOptions = ({
	activeIcon,
	defaultIcon,
	options,
	editor,
	hideIndicator = false,
}: {
	options: OptionTypes[]
	editor: Editor
	activeIcon?: React.ReactNode
	defaultIcon: React.ReactNode
	hideIndicator?: boolean
}) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant={'ghost'}
					className={'h-7 space-x-1 px-2 py-1'}
				>
					{activeIcon ? activeIcon : defaultIcon}
					{!hideIndicator && <ChevronDown size={12} />}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="flex max-h-[50vh] w-fit flex-col gap-0.5 overflow-scroll p-1"
				sideOffset={8}
			>
				{options.map((option, index) => {
					if (isLabel(option)) {
						return (
							<div className="my-0.5 space-y-0.5" key={index}>
								<p
									key={index}
									className="text-muted-foreground mx-1 text-xs font-bold uppercase"
								>
									{option.label}
								</p>
								<Separator />
							</div>
						)
					} else if (isOption(option)) {
						return (
							<Button
								key={index}
								variant={'ghost'}
								className={`h-fit justify-start space-x-2 rounded-sm px-2 py-1 ${
									option.isActive?.(editor)
										? 'bg-accent text-accent-foreground'
										: ''
								}`}
								onClick={() => option.onClick(editor)}
								disabled={!option.can(editor)}
							>
								{option.icon(14)}
								<span>{option.tooltip}</span>
							</Button>
						)
					}
				})}
			</PopoverContent>
		</Popover>
	)
}
