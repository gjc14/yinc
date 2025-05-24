import { cn } from '~/lib/utils'

const AdminSectionWrapper = ({
	children,
	className,
}: {
	children?: React.ReactNode
	className?: string
}) => {
	return (
		<section
			className={cn(
				'relative grow flex flex-col p-2 w-full h-auto gap-5 overflow-auto md:px-5 md:py-3',
				className,
			)}
		>
			{children}
		</section>
	)
}

const AdminHeader = ({
	children,
	className,
}: {
	children?: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'flex justify-between items-center flex-wrap gap-3',
				className,
			)}
		>
			<>{children}</>
		</div>
	)
}

const AdminTitle = ({
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
					className={cn('text-sm text-muted-foreground', descriptionClassName)}
				>
					{description}
				</p>
			)}
			{children}
		</div>
	)
}

const AdminActions = ({
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

const AdminContent = ({
	children,
	className,
}: {
	children?: React.ReactNode
	className?: string
}) => {
	return (
		<main
			className={cn(
				'w-full h-full flex flex-col items-center justify-center gap-2 overflow-auto',
				className,
			)}
		>
			{children}
		</main>
	)
}

export {
	AdminActions,
	AdminHeader,
	AdminSectionWrapper,
	AdminTitle,
	AdminContent,
}
