import * as React from 'react'

import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { PlusCircle, TriangleAlert, X } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from '~/components/ui/command'
import { cn } from '~/lib/utils'

type Option = Record<'value' | 'label', string>

interface BadgeProps {
	option: Option
	handleUnselect: (option: Option) => void
}

const DefaultBadge = ({ option, handleUnselect }: BadgeProps) => {
	return (
		<Badge key={option.value} className="my-auto rounded-full">
			{option.label}
			<button
				className="ring-offset-background focus:ring-ring ml-1.5 cursor-pointer rounded-full outline-hidden focus:ring-2"
				onClick={() => handleUnselect(option)}
			>
				<X className="h-3 w-3" />
			</button>
		</Badge>
	)
}

interface MultiSelectInputProps {
	/** Array of { value, label } to select from */
	options?: Option[]
	/** options selected by default */
	defaultSelected?: Option[]
	/** Current selected options */
	selected?: Option[]
	/** Callback function when the selected options change, returns current select state */
	onSelectedChange?: (selected: Option[]) => void
	/** Callback function to create id for the new option created @default Math.random().toString(36).slice(2) */
	createId?: (value: string) => string
	/** Placeholder text for the input field */
	placeholder?: string
	/** Additional class names for the input field */
	className?: string
	/** Custom badge component to render selected options */
	badge?: (props: BadgeProps) => React.ReactNode
}

export const MultiSelect = (props: MultiSelectInputProps) => {
	const internalMultiSelectRef = React.useRef<InternalMultiSelectRef>(null)

	return (
		<Command
			onKeyDown={e => {
				e.stopPropagation()
				internalMultiSelectRef.current?.handleKeyDown(e)
			}}
			className="overflow-visible bg-transparent"
		>
			<InternalMultiSelect {...props} ref={internalMultiSelectRef} />
		</Command>
	)
}

type InternalMultiSelectRef = {
	handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
}

const InternalMultiSelect = React.forwardRef<
	InternalMultiSelectRef,
	MultiSelectInputProps
>((props, ref) => {
	const {
		options = [],
		defaultSelected,
		selected,
		onSelectedChange,
		createId = v => Math.random().toString(36).slice(2),
		placeholder,
		className,
		badge: BadgeComponent = DefaultBadge,
	} = props

	const count = useCommandState(s => s.filtered.count)
	const [inputValue, setInputValue] = React.useState('')
	const [isComposing, setIsComposing] = React.useState(false)
	const [open, setOpen] = React.useState(false)
	const [displayCreateButton, setDisplayCreateButton] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)

	const [internalSelected, setInternalSelected] = React.useState<Option[]>(
		defaultSelected ?? [],
	)

	const isControlled = selected !== undefined
	const currentSelected = isControlled ? selected : internalSelected

	const selectableOptions = options.filter(
		o => !currentSelected.some(s => s.value === o.value),
	)

	const noOptions = count === 0

	/** Helper function to update (un)controlled selected state */
	const handleUpdate = React.useCallback(
		(selected: Option[]) => {
			onSelectedChange?.(selected)
			!isControlled && setInternalSelected(selected)
		},
		[onSelectedChange, isControlled],
	)

	const handleUnselect = (option: Option) => {
		handleUpdate(currentSelected.filter(s => s.value !== option.value))
	}

	const optionLabelExists = (label: string, options: Option[]) => {
		return options.some(
			option =>
				option.label.trim().toLowerCase() === label.trim().toLowerCase(),
		)
	}

	/** Helper function to handle new option creation @returns boolean */
	const createNewOption = React.useCallback(
		(label: string) => {
			if (!label.trim()) return false
			const labelExists = optionLabelExists(label, currentSelected)
			if (labelExists) {
				setError('Label already exists')
				return false
			}

			const id = createId(label.trim())
			const newOption: Option = {
				value: id,
				label: label.trim(),
			}
			handleUpdate([...currentSelected, newOption])

			return true
		},
		[currentSelected, createId, handleUpdate],
	)

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			setError(null)
			if (isComposing) return

			if (e.key === 'Enter') {
				// Create new option if inputValue is not empty and no options are available
				if (inputValue && noOptions && createNewOption(inputValue)) {
					// Clear input after creating new option
					setInputValue('')
				}
			}
			if (e.key === 'Delete' || e.key === 'Backspace') {
				if (inputValue === '') {
					handleUnselect(currentSelected[currentSelected.length - 1])
				}
			}
		},
		[isComposing, inputValue, createNewOption, handleUnselect, currentSelected],
	)

	React.useImperativeHandle(ref, () => ({
		handleKeyDown,
	}))

	const inputRef = React.useRef<HTMLInputElement>(null)
	const handleContainerClick = () => {
		inputRef.current?.focus()
	}

	return (
		<>
			<div
				className={cn(
					'group border-input ring-offset-background focus-within:ring-ring focus-within:ring-offset cursor-text rounded-md border px-2 py-2 text-sm focus-within:ring-1',
					className,
				)}
				onClick={handleContainerClick}
			>
				<div className="flex flex-wrap items-center gap-1">
					{currentSelected.map(option => (
						<div key={option.value} onClick={e => e.stopPropagation()}>
							<BadgeComponent option={option} handleUnselect={handleUnselect} />
						</div>
					))}

					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						onCompositionStart={() => {
							setIsComposing(true)
						}}
						onCompositionEnd={() => {
							setIsComposing(false)
						}}
						placeholder={placeholder ?? 'Select...'}
						className="placeholder:text-muted-foreground ml-1 flex-1 bg-transparent outline-hidden"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				{open && (
					// Canvas
					<CommandList>
						{/**
						 * User flow:
						 *
						 * 1. Focus and display selectableOptions in CommandGroup (not applicable if no options provided)
						 * 2. If inputValue, filter selectableOptions (not applicable if no options provided)
						 * 3. Display add new item option if inputValue and no options match (both empty and non-empty should work)
						 */}
						<div
							className={`bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-hidden`}
						>
							{/* Rendered when count = 0 */}
							{inputValue.trim() ? (
								<CommandPrimitive.Empty className="p-1 text-sm">
									<button
										onMouseDown={e => {
											e.preventDefault()
											e.stopPropagation()
										}}
										onClick={() => {
											if (createNewOption(inputValue)) {
												setInputValue('')
											}
										}}
										className="bg-accent flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none"
									>
										<PlusCircle className="mr-2 h-4 w-4" />"{inputValue.trim()}"
										<kbd className="ml-auto text-xs text-nowrap">return ⏎</kbd>
									</button>
								</CommandPrimitive.Empty>
							) : (
								<CommandPrimitive.Empty className="py-6 text-center text-sm">
									No options found...
								</CommandPrimitive.Empty>
							)}

							<CommandGroup className={noOptions ? 'hidden' : ''}>
								{error && (
									<div className="mb-2 rounded-md border border-amber-500/50 px-2 py-1 text-amber-600">
										<p className="text-sm">
											<TriangleAlert
												className="me-3 -mt-0.5 inline-flex opacity-60"
												size={16}
												aria-hidden="true"
											/>
											{error}
										</p>
									</div>
								)}

								{selectableOptions.map(option => (
									<CommandItem
										key={option.value}
										onMouseDown={e => {
											e.preventDefault()
											e.stopPropagation()
										}}
										onSelect={() => {
											handleUpdate([...currentSelected, option])
											setInputValue('')
										}}
										className="cursor-pointer"
									>
										{option.label}
									</CommandItem>
								))}

								{inputValue.trim() &&
									!optionLabelExists(inputValue, selectableOptions) && (
										<CommandItem
											onMouseDown={e => {
												e.preventDefault()
												e.stopPropagation()
											}}
											onSelect={() => {
												if (createNewOption(inputValue)) {
													setInputValue('')
												}
											}}
											className="cursor-pointer"
										>
											<PlusCircle className="mr-2 h-4 w-4" />"
											{inputValue.trim()}"
											<kbd className="ml-auto text-xs text-nowrap">
												return ⏎
											</kbd>
										</CommandItem>
									)}
							</CommandGroup>
						</div>
					</CommandList>
				)}
			</div>
		</>
	)
})
