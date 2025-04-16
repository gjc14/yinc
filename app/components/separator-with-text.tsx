import { cn } from '~/lib/utils'

/**
 * Input your text as children. To change separator color, use { color: 'your-color' }.
 */
const SeparatorWithText = ({
	className,
	paddingY = '12px',
	text,
}: {
	className?: string
	paddingY?: string
	text: string
}) => {
	return (
		<div
			className={cn(
				'flex items-center text-muted-foreground text-xs',
				className,
			)}
			style={{ paddingTop: paddingY, paddingBottom: paddingY }}
		>
			<hr className="grow border-current" />
			<span className={'px-3'}>{text}</span>
			<hr className="grow border-current" />
		</div>
	)
}

export default SeparatorWithText
