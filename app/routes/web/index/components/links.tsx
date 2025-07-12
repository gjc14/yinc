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
		link: 'https://github.com/gjc14',
		text: '@gjc14',
	},

	linkedin: {
		title: 'Linkedin',
		icon: <LINKEDIN />,
		link: 'https://www.linkedin.com/in/yinctw/',
		text: '@yinctw',
	},

	instagram: {
		title: 'Instagram',
		icon: <INSTAGRAM />,
		link: 'https://www.instagram.com/gnielcyc/',
		text: '@gnielcyc',
	},

	// readcv: {
	// 	title: 'Read CV',
	// 	icon: <NotepadText className="w-full h-full" />, // Changed to ReadcvIcon
	// 	link: '/cv/resume_chiu_yin_chen_dev.pdf',
	// 	text: '@developer',
	// },
	// readcv2: {
	// 	title: 'Read CV',
	// 	icon: <NotepadText className="w-full h-full" />, // Changed to ReadcvIcon
	// 	link: '/cv/resume_chiu_yin_chen_mngr.pdf',
	// 	text: '@manager',
	// },

	blog: {
		title: 'Blog',
		icon: <PenBox className="h-full w-full" />, // Changed to BlogIcon
		link: '/blog',
		text: 'yinc.me',
	},

	bubu: {
		title: 'BUBU E-Scooter',
		icon: <Plane className="h-full w-full" />, // Changed to BlogIcon
		link: 'https://ridebubu.com',
		text: '#share #nccu',
	},
}
