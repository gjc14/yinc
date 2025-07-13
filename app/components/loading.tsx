import { Loader2 } from 'lucide-react'

import { cn } from '~/lib/utils'

export const Loading = ({
	className,
	size = 16,
}: {
	className?: string
	size?: number
}) => {
	return <Loader2 size={size} className={cn('animate-spin', className)} />
}

export const FullScreenLoader = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				`fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-md`,
				className,
			)}
		>
			<SymmetrySpinner />
		</div>
	)
}

export const SymmetrySpinner = ({
	className,
	white,
}: {
	className?: string
	white?: boolean
}) => {
	return (
		<div
			className={cn(
				'border-y-primary z-50 h-16 w-16 animate-spin rounded-full border-4 border-x-transparent ease-in-out',
				white && 'border-y-primary-foreground',
				className,
			)}
		></div>
	)
}
