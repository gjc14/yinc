import * as React from 'react'
import { DayPicker, type DropdownProps } from 'react-day-picker'

import { SelectTrigger } from '@radix-ui/react-select'
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDown,
	ChevronUp,
} from 'lucide-react'

import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import { Select, SelectContent, SelectItem, SelectValue } from './select'

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: React.ComponentProps<typeof DayPicker>) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				'p-3 inline-flex flex-col items-center justify-center',
				className,
			)}
			classNames={{
				// Wrapper
				months:
					'relative inline-flex flex-col sm:flex-row [&>*:nth-child(n+3)]:mt-4 sm:[&>*:nth-child(n+3)]:mt-0 sm:[&>*:nth-child(n+3)]:ml-4',
				// Table classes
				month_grid: 'w-fit grid border-collapse',
				// Caption
				month_caption:
					'flex justify-center relative pt-1 items-center text-sm font-medium',
				dropdowns: 'flex items-center gap-2',
				button_previous: cn(
					buttonVariants({ variant: 'outline' }),
					'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 z-10',
				),
				button_next: cn(
					buttonVariants({ variant: 'outline' }),
					'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 z-10',
				),

				// Sunday to Saturday
				weekday:
					'inline-flex justify-center text-muted-foreground w-8 font-normal text-[0.8rem] pt-4 pb-2',
				// Week rows
				weeks: 'flex flex-col gap-y-2',

				// Day Cells
				day: cn(
					'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent hover:bg-accent not-aria-selected:hover:rounded-md',
					props.mode !== 'range' && 'rounded-md',
				),
				day_button: 'size-8 p-0 font-normal',
				range_start: 'rounded-l-md',
				range_end: 'rounded-r-md',
				selected:
					'selected bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
				today: 'not-aria-selected:rounded-md bg-accent text-accent-foreground',
				outside:
					'outside text-muted-foreground aria-selected:text-muted-foreground',
				disabled: 'text-muted-foreground opacity-50',
				range_middle:
					'aria-selected:bg-accent aria-selected:text-accent-foreground',
				hidden: 'invisible',
				...classNames,
			}}
			components={{
				MonthsDropdown: SelectDropdown,
				YearsDropdown: SelectDropdown,
				Chevron({ orientation, className, ...rest }) {
					switch (orientation) {
						case 'left':
							return <ChevronLeft className="size-4" {...rest} />
						case 'right':
							return <ChevronRight className="size-4" {...rest} />
						case 'up':
							return <ChevronUp className="size-4" {...rest} />
						case 'down':
							return <ChevronDown className="size-4" {...rest} />
						default:
							return <></>
					}
				},
			}}
			{...props}
		/>
	)
}

export { Calendar }

function SelectDropdown(props: DropdownProps) {
	const { options, value, onChange } = props

	const handleValueChange = (newValue: string) => {
		if (onChange) {
			const syntheticEvent = {
				target: {
					value: newValue,
				},
			} as React.ChangeEvent<HTMLSelectElement>

			onChange(syntheticEvent)
		}
	}

	return (
		<Select value={value?.toString()} onValueChange={handleValueChange}>
			<SelectTrigger className="flex items-center gap-1 text-sm">
				<SelectValue />
				<ChevronsUpDown className="size-3 text-muted-foreground" />
			</SelectTrigger>
			<SelectContent>
				{options?.map(option => (
					<SelectItem
						key={option.value}
						value={option.value.toString()}
						disabled={option.disabled}
					>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
