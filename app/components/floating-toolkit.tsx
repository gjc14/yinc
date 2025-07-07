import { useNavigate } from 'react-router'

import { DashboardIcon } from '@radix-ui/react-icons'
import { ChevronUp, HelpCircle, LogOut, PanelTop } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { CurrentThemeIcon, ThemeDropDownMenu } from '~/components/theme-toggle'
import { authClient } from '~/lib/auth/auth-client'

export function FloatingToolkit() {
	const navigate = useNavigate()
	const { data } = authClient.useSession()

	if (data?.user.role === 'admin') {
		return (
			<div className="fixed bottom-6 right-6 z-99999">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="icon"
							className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg hover:bg-gray-800 hover:dark:bg-gray-200"
						>
							<ChevronUp size={20} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" side="top" className="w-56 mb-2">
						<DropdownMenuItem onClick={() => navigate('/')}>
							<PanelTop className="mr-2 size-4" />
							<span>View Website</span>
						</DropdownMenuItem>

						<DropdownMenuItem onClick={() => navigate('/dashboard')}>
							<DashboardIcon className="mr-2 size-4" />
							<span>Go to Dashboard</span>
						</DropdownMenuItem>

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

						<ThemeDropDownMenu asChild>
							<DropdownMenuItem onSelect={e => e.preventDefault()}>
								<CurrentThemeIcon className="mr-2 size-4" />
								<span>Change Theme</span>
							</DropdownMenuItem>
						</ThemeDropDownMenu>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={() => authClient.signOut()}>
							<LogOut className="mr-2 size-4" />
							<span>Sign Out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		)
	}
}
