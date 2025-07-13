import { cn } from '~/lib/utils'

export const SectionWrapper = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<section className={cn('mx-auto w-full max-w-2xl px-3', className)}>
			{children}
		</section>
	)
}
