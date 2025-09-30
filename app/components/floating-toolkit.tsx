import { useState } from 'react'
import { useNavigate } from 'react-router'

import { DashboardIcon } from '@radix-ui/react-icons'
import {
	ChevronUp,
	Expand,
	HelpCircle,
	LogOut,
	Minimize2,
	PanelTop,
	PencilLine,
} from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
	CurrentThemeIcon,
	ThemeDropdownMenuSubTrigger,
} from '~/components/theme-toggle'
import { authClient } from '~/lib/auth/auth-client'

export function FloatingToolkit() {
	const [isMinimized, setIsMinumized] = useState(false)
	const navigate = useNavigate()
	const { data } = authClient.useSession()

	if (data?.user.role === 'admin') {
		return (
			<>
				{!isMinimized ? (
					<div className="fixed right-6 bottom-6 z-99999">
						<Minimize2
							className="bg-primary-foreground absolute -top-1 -right-1 size-5 cursor-pointer rounded-full border p-0.75"
							onClick={() => setIsMinumized(true)}
						/>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="icon"
									className="h-12 w-12 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 dark:bg-white dark:text-black hover:dark:bg-gray-200"
								>
									<ChevronUp size={20} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								side="top"
								className="mb-2 w-56"
							>
								<DropdownMenuLabel>Quick Toolkit</DropdownMenuLabel>
								<DropdownMenuItem onClick={() => navigate('/')}>
									<PanelTop className="mr-2 size-4" />
									<span>View Website</span>
								</DropdownMenuItem>

								<DropdownMenuItem onClick={() => navigate('/dashboard')}>
									<DashboardIcon className="mr-2 size-4" />
									<span>Go to Dashboard</span>
								</DropdownMenuItem>

								<DropdownMenuItem
									onClick={() => navigate('/dashboard/blog/new')}
								>
									<PencilLine className="mr-2 size-4" />
									<span>New Post</span>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem
									onClick={() =>
										window.open(
											'https://github.com/gjc14/papa/discussions',
											'_blank',
											'noopener,noreferrer',
										)
									}
								>
									<HelpCircle className="mr-2 size-4" />
									<span>Help & Resources</span>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<ThemeDropdownMenuSubTrigger className="cursor-pointer">
									<CurrentThemeIcon className="mr-2 size-4" />
									Change Theme
								</ThemeDropdownMenuSubTrigger>

								<DropdownMenuSeparator />

								<DropdownMenuItem onClick={() => authClient.signOut()}>
									<LogOut className="mr-2 size-4" />
									<span>Sign Out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				) : (
					<div
						className="bg-primary text-primary-foreground fixed right-6 bottom-6 z-99999 cursor-pointer rounded-full p-0.75"
						onClick={() => setIsMinumized(false)}
					>
						<Expand className="size-3" />
					</div>
				)}
			</>
		)
	}
}
