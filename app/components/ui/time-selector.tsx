import { setHours, setMinutes } from 'date-fns'
import { Minus, Plus } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'

export const TimeSelector = ({
	date,
	setDate,
	hour12 = true,
	className,
}: {
	date: Date | undefined
	setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
	hour12?: boolean
	className?: string
}) => {
	if (!date) {
		return undefined
	}

	const currentHour = date.getHours()
	const currentMinute = date.getMinutes()

	// 12-hour format calculations
	const isPM = currentHour >= 12
	const displayHour = hour12
		? currentHour === 0
			? 12
			: currentHour > 12
				? currentHour - 12
				: currentHour
		: currentHour

	const handleHourChange = (value: string) => {
		const newHour = parseInt(value, 10)
		let actualHour = newHour

		if (hour12) {
			if (isPM && newHour !== 12) {
				actualHour = newHour + 12
			} else if (!isPM && newHour === 12) {
				actualHour = 0
			}
		}

		setDate(setHours(date, actualHour))
	}

	const handleMinuteChange = (value: string) => {
		const newMinute = parseInt(value, 10)
		setDate(setMinutes(date, newMinute))
	}

	const togglePeriod = () => {
		const newHour = isPM ? currentHour - 12 : currentHour + 12
		setDate(setHours(date, Math.max(0, Math.min(23, newHour))))
	}

	const adjustTime = (type: 'hour' | 'minute', direction: 'up' | 'down') => {
		if (type === 'hour') {
			const change = direction === 'up' ? 1 : -1
			const newHour = (currentHour + change + 24) % 24
			setDate(setHours(date, newHour))
		} else {
			const change = direction === 'up' ? 1 : -1
			const newMinute = (currentMinute + change + 60) % 60
			setDate(setMinutes(date, newMinute))
		}
	}

	return (
		<div className={cn('p-3', className)}>
			<div className="flex items-center justify-center space-x-2">
				{/* Hour Selector */}
				<div className="flex flex-col items-center space-y-1">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => adjustTime('hour', 'up')}
						className="h-6 w-8 p-0"
					>
						<Plus className="h-3 w-3" />
					</Button>

					<Select
						value={displayHour.toString()}
						onValueChange={handleHourChange}
					>
						<SelectTrigger className="w-16 h-8 text-center">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="max-h-[200px]">
							{Array.from({ length: hour12 ? 12 : 24 }, (_, i) => {
								const value = hour12 ? i + 1 : i
								const displayValue = hour12 && value === 0 ? 12 : value
								return (
									<SelectItem key={value} value={displayValue.toString()}>
										{displayValue.toString().padStart(2, '0')}
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>

					<Button
						variant="ghost"
						size="sm"
						onClick={() => adjustTime('hour', 'down')}
						className="h-6 w-8 p-0"
					>
						<Minus className="h-3 w-3" />
					</Button>
				</div>

				<div className="text-lg font-bold">:</div>

				{/* Minute Selector */}
				<div className="flex flex-col items-center space-y-1">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => adjustTime('minute', 'up')}
						className="h-6 w-8 p-0"
					>
						<Plus className="h-3 w-3" />
					</Button>

					<Select
						value={currentMinute.toString()}
						onValueChange={handleMinuteChange}
					>
						<SelectTrigger className="w-16 h-8 text-center">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="max-h-[200px]">
							{Array.from({ length: 60 }, (_, i) => (
								<SelectItem key={i} value={i.toString()}>
									{i.toString().padStart(2, '0')}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						variant="ghost"
						size="sm"
						onClick={() => adjustTime('minute', 'down')}
						className="h-6 w-8 p-0"
					>
						<Minus className="h-3 w-3" />
					</Button>
				</div>

				{/* AM/PM Selector */}
				{hour12 && (
					<div className="">
						<Button
							variant={'ghost'}
							size="sm"
							onClick={togglePeriod}
							className="w-12 h-8 text-xs"
						>
							{isPM ? 'PM' : 'AM'}
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
