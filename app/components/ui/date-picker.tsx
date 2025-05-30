import * as React from 'react'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

export function DatePicker({
	date,
	setDate,
}: {
	date: Date | undefined
	setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'justify-start text-left font-normal',
						!date && 'text-muted-foreground',
					)}
				>
					<CalendarIcon />
					{date ? format(date, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
			</PopoverContent>
		</Popover>
	)
}
