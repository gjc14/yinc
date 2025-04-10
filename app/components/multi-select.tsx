/**
 * @see https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-multi-select.tsx
 */
import * as React from 'react'

import { Command as CommandPrimitive } from 'cmdk'
import { X } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	GetCommandState,
	type GetCommandStateRef,
} from '~/components/ui/command'

type Option = Record<'value' | 'label', string>
type SelectState = Option[]

interface MultiSelectInputProps {
	options: Option[]
	selected?: SelectState
	defaultSelected?: Option[]
	onSelectedChange?: (selected: SelectState) => void
	onUnSelect?: (option: Option) => void
	onEnterNewValue?: (value: string) => string
	placeholder?: string
}

/**
 * @param options - Array of { value, label } to select from
 * @param selected - Current selected options (controlled mode)
 * @param defaultSelected - Array of { value, label } to be selected by default (uncontrolled mode)
 * @param onSelectedChange - Callback function to be called when the selected options change, returns all selected options
 * @param onUnSelect - Callback function to be called when an option is unselected
 * @param onEnterNewValue - Callback function to generate id for when the new value entered, id default to label
 * @param placeholder - Placeholder text for the input field
 * @returns
 */
export const MultiSelect = ({
	options,
	selected: controlledSelected,
	defaultSelected,
	onSelectedChange,
	onUnSelect,
	onEnterNewValue,
	placeholder,
}: MultiSelectInputProps) => {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const getCommandStateRef = React.useRef<GetCommandStateRef>(null)
	const [open, setOpen] = React.useState(false)
	const [internalSelected, setInternalSelected] = React.useState<Option[]>(
		defaultSelected ?? [],
	)
	const [inputValue, setInputValue] = React.useState('')
	const [isComposing, setIsComposing] = React.useState(false)

	// Determine if we're in controlled or uncontrolled mode
	const isControlled = controlledSelected !== undefined
	const selected = isControlled ? controlledSelected : internalSelected

	// Update internal state when controlled value changes
	React.useEffect(() => {
		if (isControlled && controlledSelected) {
			setInternalSelected(controlledSelected)
		}
	}, [isControlled, controlledSelected])

	// Update selected state function that handles both controlled and uncontrolled modes
	const updateSelected = React.useCallback(
		(newSelected: SelectState) => {
			if (!isControlled) {
				setInternalSelected(newSelected)
			}
			onSelectedChange?.(newSelected)
		},
		[isControlled, onSelectedChange],
	)

	const handleUnselect = React.useCallback(
		(option: MultiSelectInputProps['options'][number]) => {
			const newSelected = selected.filter(s => s.value !== option.value)

			// This is a workaround to make sure the unselect callback is called after the selected state is updated
			setTimeout(() => {
				onUnSelect?.(option)
				updateSelected(newSelected)
			}, 0)
		},
		[selected, onUnSelect, updateSelected],
	)

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (isComposing) return
			const input = inputRef.current
			if (input) {
				if (e.key === 'Enter') {
					if (
						input.value !== '' &&
						getCommandStateRef.current?.getCommandState().filtered.count === 0
					) {
						const id = onEnterNewValue?.(input.value) ?? input.value
						const newSelected = [...selected, { value: id, label: input.value }]
						updateSelected(newSelected)
						setInputValue('')
					}
				}
				if (e.key === 'Delete' || e.key === 'Backspace') {
					if (input.value === '') {
						handleUnselect(selected[selected.length - 1])
					}
				}
				// This is not a default behaviour of the <input /> field
				if (e.key === 'Escape') {
					input.blur()
				}
			}
		},
		[isComposing, onEnterNewValue, selected, handleUnselect, updateSelected],
	)

	const selectables = options.filter(option => {
		return !selected.some(
			selectedOption => selectedOption.value === option.value,
		)
	})

	return (
		<Command
			onKeyDown={e => {
				e.stopPropagation()
				handleKeyDown(e)
			}}
			className="overflow-visible bg-transparent"
		>
			<GetCommandState ref={getCommandStateRef} />
			<div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset">
				<div className="flex flex-wrap gap-1">
					{selected.map(option => {
						return (
							<Badge key={option.value} variant="secondary">
								{option.label}
								<button
									className="ml-1 rounded-full outline-hidden ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={e => {
										if (e.key === 'Enter') {
											handleUnselect(option)
										}
									}}
									onMouseDown={e => {
										e.preventDefault()
										e.stopPropagation()
									}}
									onClick={() => handleUnselect(option)}
								>
									<X className="h-3 w-3 -mr-0.5 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						)
					})}
					{/* Avoid having the "Search" Icon */}
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
						className={`flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground ${
							selected.length > 0 ? 'ml-2' : ''
						}`}
					/>
				</div>
			</div>
			<div className="relative mt-2">
				<CommandList>
					{open &&
						(selectables.length > 0 ? (
							<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden animate-in">
								<CommandEmpty>
									No results found. Enter to create one.
								</CommandEmpty>
								<CommandGroup className="h-full overflow-auto">
									{selectables.map(option => {
										return (
											<CommandItem
												key={option.value}
												onMouseDown={e => {
													e.preventDefault()
													e.stopPropagation()
												}}
												onSelect={value => {
													setInputValue('')
													const newSelected = [...selected, option]
													updateSelected(newSelected)
												}}
												className={'cursor-pointer'}
											>
												{option.label}
											</CommandItem>
										)
									})}
								</CommandGroup>
							</div>
						) : (
							<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden animate-in">
								<CommandGroup className="h-full overflow-auto">
									<CommandItem
										onMouseDown={undefined}
										onSelect={undefined}
										className={'cursor-default'}
										disabled
									>
										Add some options...
									</CommandItem>
								</CommandGroup>
							</div>
						))}
				</CommandList>
			</div>
		</Command>
	)
}
