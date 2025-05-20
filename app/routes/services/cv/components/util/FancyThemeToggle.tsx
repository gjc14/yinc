// FancyDarkModeToggle
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'

import { cn } from '~/lib/utils'

import { Cloud } from '../../icons/cloud'
import { Star } from '../../icons/star'

export const FancyDarkModeToggle = ({ className }: { className?: string }) => {
	const { theme, setTheme } = useTheme()

	return (
		<button
			onClick={() => {
				setTheme(theme === 'dark' ? 'light' : 'dark')
			}}
			className={cn(
				`relative flex w-14 rounded-full bg-gradient-to-b object-contain p-1 shadow-lg ${
					theme === 'light'
						? 'justify-end from-sky-500 to-sky-200'
						: 'justify-start from-indigo-800 to-indigo-500'
				}`,
				className,
			)}
		>
			<Thumb mode={theme} />
			{theme === 'light' && <Clouds />}
			{theme === 'dark' && <Stars />}
		</button>
	)
}

const Thumb = ({ mode }: { mode: string | undefined }) => {
	return (
		<motion.div
			layout
			transition={{
				duration: 0.75,
				type: 'spring',
			}}
			className="relative h-5 w-5 overflow-hidden rounded-full shadow-lg"
		>
			<div
				className={`absolute inset-0 ${
					mode === 'dark'
						? 'bg-slate-100'
						: 'animate-pulse rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500'
				}`}
			/>
			{mode === 'light' && <SunCenter />}
			{mode === 'dark' && <MoonSpots />}
		</motion.div>
	)
}

const SunCenter = () => (
	<div className="absolute inset-[3px] rounded-full bg-orange-400" />
)

const MoonSpots = () => (
	<>
		<motion.div
			initial={{ x: -4, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ delay: 0.15, duration: 0.35 }}
			className="absolute right-2.5 bottom-1 h-1.5 w-1.5 rounded-full bg-slate-300"
		/>
		<motion.div
			initial={{ x: -4, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ delay: 0.2, duration: 0.35 }}
			className="absolute bottom-4 left-1 h-1.5 w-1.5 rounded-full bg-slate-300"
		/>
		<motion.div
			initial={{ x: -4, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ delay: 0.25, duration: 0.35 }}
			className="absolute top-2 right-2 h-2 w-2 rounded-full bg-slate-300"
		/>
	</>
)

const Stars = () => {
	return (
		<>
			<motion.span
				animate={{
					scale: [0.75, 1, 0.75],
					opacity: [0.75, 1, 0.75],
				}}
				transition={{
					repeat: Infinity,
					duration: 5,
					ease: 'easeIn',
				}}
				className="absolute top-1 right-5 text-xs text-slate-300"
			>
				<Star className="h-2 w-2" />
			</motion.span>
			<motion.span
				animate={{
					scale: [1, 0.75, 1],
					opacity: [0.5, 0.25, 0.5],
				}}
				transition={{
					repeat: Infinity,
					duration: 3.5,
					ease: 'easeIn',
				}}
				style={{ rotate: '-45deg' }}
				className="absolute top-1.5 right-2 text-lg text-slate-300"
			>
				<Star className="h-2 w-2" />
			</motion.span>
			<motion.span
				animate={{
					scale: [1, 0.5, 1],
					opacity: [1, 0.5, 1],
				}}
				style={{ rotate: '45deg' }}
				transition={{
					repeat: Infinity,
					duration: 2.5,
					ease: 'easeIn',
				}}
				className="absolute top-4 right-4 text-slate-300"
			>
				<Star className="h-2 w-2" />
			</motion.span>
		</>
	)
}

const Clouds = () => {
	return (
		<>
			<motion.span
				animate={{
					x: [-20, -15, -10, -5, 0],
					opacity: [0, 1, 0.75, 1, 0],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					delay: 0.25,
				}}
				className="absolute top-0.5 left-5 text-xs text-white"
			>
				<Cloud className="h-2 w-2" />
			</motion.span>
			<motion.span
				animate={{
					x: [-10, 0, 10, 20, 30],
					opacity: [0, 1, 0.75, 1, 0],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					delay: 0.5,
				}}
				className="absolute top-2 left-1 text-lg text-white"
			>
				<Cloud className="h-2 w-2" />
			</motion.span>
			<motion.span
				animate={{ x: [-7, 0, 7, 14, 21], opacity: [0, 1, 0.75, 1, 0] }}
				transition={{
					duration: 12.5,
					repeat: Infinity,
				}}
				className="absolute top-3 left-4 text-white"
			>
				<Cloud className="h-2 w-2" />
			</motion.span>
			<motion.span
				animate={{
					x: [-15, 0, 15, 30, 45],
					opacity: [0, 1, 0.75, 1, 0],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					delay: 0.75,
				}}
				className="absolute top-4 left-3 text-xs text-white"
			>
				<Cloud className="h-2 w-2" />
			</motion.span>
		</>
	)
}
