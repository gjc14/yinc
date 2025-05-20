import { Link } from 'react-router'

import { Home } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

import { Github } from '../../icons/github'
import { Linkedin } from '../../icons/linkedin'
import { OutlineButton } from '../buttons/OutlineButton'
import { FancyDarkModeToggle } from '../util/FancyThemeToggle'

export const Header = () => {
	return (
		<header className="h-[72px] px-4 flex items-center justify-between sticky top-0 z-20 border-b bg-primary-foreground/50 dark:bg-zinc-900/50 backdrop-blur-sm">
			<div className="flex items-center gap-2">
				<SocialLinks />
				<Link to="/">
					<Home size={20} className="transition-colors hover:text-secondary" />
				</Link>
			</div>
			<div className="flex items-center gap-2 md:gap-5">
				<FancyDarkModeToggle />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<OutlineButton>My Resumes</OutlineButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={() =>
								window.open('/cv/resume_chiu_yin_chen_mngr.pdf', '_blank')
							}
						>
							As a manager
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								window.open('/cv/resume_chiu_yin_chen_dev.pdf', '_blank')
							}
						>
							As a developer
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}

export const SocialLinks = () => (
	<div className="flex items-center text-lg gap-2">
		<Link
			className="transition-colors"
			to="https://www.github.com/gjc14"
			target="_blank"
			rel="nofollow"
		>
			<Github className="w-5 h-5 text-primary hover:text-secondary" />
		</Link>
		<Link
			className="transition-colors"
			to="https://www.linkedin.com/in/yinctw"
			target="_blank"
			rel="nofollow"
		>
			<Linkedin className="w-7 h-7 text-primary hover:text-secondary" />
		</Link>
	</div>
)
