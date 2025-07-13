import { forwardRef } from 'react'

import { Moon, Sun, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'

import { Button } from './ui/button'

type ThemeToggleProps = {
	size?: 'sm' | 'md' | 'lg'
	className?: string
}

export const CurrentThemeIcon = ({
	size = 'sm',
	className,
}: {
	size?: 'sm' | 'md' | 'lg'
	className?: string
}) => {
	const { theme } = useTheme()

	const iconSizes = {
		sm: 'size-4',
		md: 'size-5',
		lg: 'size-6',
	}

	return (
		<span
			className={cn('relative flex items-center justify-center', className)}
		>
			<Sun
				suppressHydrationWarning
				className={`absolute ${iconSizes[size]} ${theme === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'} transition-transform`}
			/>

			<Moon
				suppressHydrationWarning
				className={`absolute ${iconSizes[size]} ${theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'} transition-transform`}
			/>

			<SunMoon
				suppressHydrationWarning
				className={`absolute ${iconSizes[size]} ${theme === 'system' || theme === undefined ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'} transition-transform`}
			/>
			<div
				suppressHydrationWarning
				className={`absolute ${iconSizes[size]} ${![undefined, 'light', 'dark', 'system'].includes(theme) ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'} bg-background size-4 rounded border transition-transform`}
			/>
			<span className="sr-only">Toggle theme</span>
		</span>
	)
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
	({ size = 'sm', className }, ref) => {
		const { setTheme } = useTheme()

		const buttonSizes = {
			sm: 'size-7',
			md: 'size-9',
			lg: 'size-11',
		}

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						ref={ref}
						variant="outline"
						size="icon"
						className={cn(buttonSizes[size], className)}
					>
						<CurrentThemeIcon size={size} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={() => {
							setTheme('light')
						}}
					>
						Light
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setTheme('dark')
						}}
					>
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setTheme('system')
						}}
					>
						System
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	},
)

// DropdownMenu
export const ThemeDropDownMenu = ({
	children,
	asChild = false,
	className,
}: {
	children: React.ReactNode
	asChild?: boolean
	className?: string
}) => {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={asChild}>{children}</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className={cn('bg-secondary', className)}
			>
				<DropdownMenuItem
					onClick={() => {
						setTheme('light')
					}}
				>
					<Sun size={16} className="mr-2" />
					Light
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setTheme('dark')
					}}
				>
					<Moon size={16} className="mr-2" />
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setTheme('system')
					}}
				>
					<SunMoon size={16} className="mr-2" />
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
