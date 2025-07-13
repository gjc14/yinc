import { cn } from '~/lib/utils'

const DashboardSectionWrapper = ({
	children,
	className,
}: {
	children?: React.ReactNode
	className?: string
}) => {
	return (
		<section
			className={cn(
				'relative flex h-auto w-full grow flex-col gap-5 overflow-auto p-2 md:px-5 md:py-3',
				className,
			)}
		>
			{children}
		</section>
	)
}

const DashboardHeader = ({
	children,
	className,
}: {
	children?: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'flex flex-wrap items-center justify-between gap-3',
				className,
			)}
		>
			<>{children}</>
		</div>
	)
}

const DashboardTitle = ({
	className,
	title,
	titleClassName,
	description,
	descriptionClassName,
	children,
}: {
	className?: string
	title?: string
	titleClassName?: string
	description?: string
	descriptionClassName?: string
	children?: React.ReactNode
}) => {
	return (
		<div className={cn('space-y-2', className)}>
			{title && <h2 className={titleClassName}>{title}</h2>}
			{description && (
				<p
					className={cn('text-muted-foreground text-sm', descriptionClassName)}
				>
					{description}
				</p>
			)}
			{children}
		</div>
	)
}

const DashboardActions = ({
	children,
	className,
}: {
	children?: React.ReactNode
	className?: string
}) => {
	return (
		<div className={cn('flex flex-nowrap items-center gap-2', className)}>
			{children}
		</div>
	)
}

const DashboardContent = ({
	children,
	className,
}: {
	children?: React.ReactNode
	className?: string
}) => {
	return (
		<main
			className={cn('flex h-full w-full flex-1 gap-2 overflow-auto', className)}
		>
			{children}
		</main>
	)
}

export {
	DashboardActions,
	DashboardHeader,
	DashboardSectionWrapper,
	DashboardTitle,
	DashboardContent,
}
