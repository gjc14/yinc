import { NotepadText, PenBox, Plane } from 'lucide-react'

import { GITHUB, INSTAGRAM, LINKEDIN } from './icons'

type SocialMedia = (typeof websites)[number]

type Link = {
	title: string
	icon: React.ReactNode // Changed type to React.FunctionComponent
	link: string
	text?: string
}

const websites = [
	'github',
	'instagram',
	'linkedin',
	'readcv',
	'readcv2',
	'bubu',
]

export const LINKS: { [key in SocialMedia]: Link } = {
	github: {
		title: 'Github',
		icon: <GITHUB />,
		link: 'https://github.com/gjc14/papa.git',
		text: '@papa',
	},

	instagram: {
		title: 'Instagram',
		icon: <INSTAGRAM />,
		link: 'https://www.instagram.com/papa.erp/',
		text: '@papa.erp',
	},

	linkedin: {
		title: 'Linkedin',
		icon: <LINKEDIN />,
		link: 'https://www.linkedin.com/in/papaerp/',
		text: '@papa.erp',
	},

	blog: {
		title: 'Blog',
		icon: <PenBox className="h-full w-full" />, // Changed to BlogIcon
		link: '/blog',
		text: 'papa.erp',
	},
}
