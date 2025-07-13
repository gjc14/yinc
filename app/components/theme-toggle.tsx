import { forwardRef } from 'react'

import { Moon, Sun, SunMoon } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { setCustomTheme, useTheme } from '~/hooks/theme-provider'
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
				className={`${iconSizes[size]} scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90`}
			/>
			<Moon
				className={`absolute ${iconSizes[size]} scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0`}
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
							setCustomTheme('light')
						}}
					>
						Light
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setTheme('dark')
							setCustomTheme('dark')
						}}
					>
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setTheme(undefined)
							setCustomTheme(undefined)
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
						setCustomTheme('light')
					}}
				>
					<Sun size={16} className="mr-2" />
					Light
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setTheme('dark')
						setCustomTheme('dark')
					}}
				>
					<Moon size={16} className="mr-2" />
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setTheme(undefined)
						setCustomTheme(undefined)
					}}
				>
					<SunMoon size={16} className="mr-2" />
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
