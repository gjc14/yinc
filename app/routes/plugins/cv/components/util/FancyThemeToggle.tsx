// FancyDarkModeToggle
import { motion } from 'framer-motion'

import { setCustomTheme, useTheme } from '~/hooks/theme-provider'
import { cn } from '~/lib/utils'

import { Cloud } from '../../icons/cloud'
import { Star } from '../../icons/star'

export const FancyDarkModeToggle = ({ className }: { className?: string }) => {
	const { theme, setTheme } = useTheme()

	return (
		<button
			onClick={() => {
				setTheme(theme === 'dark' ? 'light' : 'dark')
				setCustomTheme(theme === 'dark' ? 'light' : 'dark')
			}}
			className={cn(
				`object-contain p-1 w-14 rounded-full flex shadow-lg relative bg-gradient-to-b ${
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

const Thumb = ({ mode }: { mode: 'light' | 'dark' }) => {
	return (
		<motion.div
			layout
			transition={{
				duration: 0.75,
				type: 'spring',
			}}
			className="h-5 w-5 rounded-full overflow-hidden shadow-lg relative"
		>
			<div
				className={`absolute inset-0 ${
					mode === 'dark'
						? 'bg-slate-100'
						: 'animate-pulse bg-gradient-to-tr from-amber-300 to-yellow-500 rounded-full'
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
			className="w-1.5 h-1.5 rounded-full bg-slate-300 absolute right-2.5 bottom-1"
		/>
		<motion.div
			initial={{ x: -4, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ delay: 0.2, duration: 0.35 }}
			className="w-1.5 h-1.5 rounded-full bg-slate-300 absolute left-1 bottom-4"
		/>
		<motion.div
			initial={{ x: -4, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ delay: 0.25, duration: 0.35 }}
			className="w-2 h-2 rounded-full bg-slate-300 absolute right-2 top-2"
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
				className="text-slate-300 text-xs absolute right-5 top-1"
			>
				<Star className="w-2 h-2" />
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
				className="text-slate-300 text-lg absolute right-2 top-1.5"
			>
				<Star className="w-2 h-2" />
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
				className="text-slate-300 absolute right-4 top-4"
			>
				<Star className="w-2 h-2" />
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
				className="text-white text-xs absolute left-5 top-0.5"
			>
				<Cloud className="w-2 h-2" />
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
				className="text-white text-lg absolute left-1 top-2"
			>
				<Cloud className="w-2 h-2" />
			</motion.span>
			<motion.span
				animate={{ x: [-7, 0, 7, 14, 21], opacity: [0, 1, 0.75, 1, 0] }}
				transition={{
					duration: 12.5,
					repeat: Infinity,
				}}
				className="text-white absolute left-4 top-3"
			>
				<Cloud className="w-2 h-2" />
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
				className="text-white absolute text-xs left-3 top-4"
			>
				<Cloud className="w-2 h-2" />
			</motion.span>
		</>
	)
}
