import { cn } from '~/lib/utils'

/**
 * Input your text as children. To change separator color, use { color: 'your-color' }.
 */
const SeparatorWithText = ({
	className,
	text,
}: {
	className?: string
	text: string
}) => {
	return (
		<div className={cn('flex items-center text-muted text-xs py-1', className)}>
			<hr className="grow border-current" />
			<span className={'px-3'}>{text}</span>
			<hr className="grow border-current" />
		</div>
	)
}

export default SeparatorWithText
