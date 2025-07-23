import type { Column } from '@tanstack/react-table'
import { MoveUpIcon } from 'lucide-react'

/**
 * SimpleSortHeader component for rendering a sortable table header.
 * @param column - The column to be sorted
 * @returns A button element for sorting the column
 */
export function SimpleSortHeader<T>({
	column,
	children,
}: {
	column: Column<T>
	children?: React.ReactNode
}) {
	const currentSorting = column.getIsSorted()

	return (
		<button
			onClick={() => {
				if (currentSorting === 'asc') {
					column.clearSorting()
				} else if (currentSorting === 'desc') {
					column.toggleSorting(false)
				} else {
					column.toggleSorting(true)
				}
			}}
			className="flex w-full cursor-pointer items-center justify-between gap-2"
		>
			{children || column.id.charAt(0).toUpperCase() + column.id.slice(1)}
			{currentSorting &&
				(currentSorting === 'desc' ? (
					<MoveUpIcon className="size-3.5 rotate-180" />
				) : (
					<MoveUpIcon className="size-3.5" />
				))}
		</button>
	)
}
