import { NavLink } from 'react-router'

import { motion } from 'motion/react'

import { ThemeToggle } from '~/components/theme-toggle'

export const Nav = () => {
	return (
		<nav className="border-muted-foreground text-muted-foreground bg-primary-foreground/50 fixed top-8 left-[50%] z-10 flex w-max -translate-x-[50%] items-center gap-6 rounded-lg border-[1px] px-3.5 py-2 text-sm shadow-lg backdrop-blur-xs">
			<NavLink
				to="/"
				className="flex items-center gap-2"
				aria-label="go to home /"
			>
				{/* If your using an image, set your logo by putting your logo image in /public/logos folder, and activate the following. Remember to change the name of your logo file */}
				{/* <div className="bg-[url('/logos/mylogo-dark-size300.png')] dark:bg-[url('/logos/mylogo-light-size300.png')] bg-cover bg-center w-10 h-3.5" /> */}
				<span>🥔</span>
				<span className="hidden">Home</span>
			</NavLink>

			{/* Add your own routes here */}
			<CustomNav to="/blog">Blog</CustomNav>
			<CustomNav to="/store">Store</CustomNav>
			<ThemeToggle className="rounded-full border-0 p-0" />
		</nav>
	)
}

const CustomNav = ({
	children,
	to,
}: {
	children: React.ReactNode
	to: string
}) => {
	return (
		<NavLink
			to={to}
			rel="nofollow"
			aria-label={`link to ${to}`}
			className="block overflow-hidden"
		>
			{({ isActive }) => {
				return (
					<motion.div
						whileHover={{ y: -20 }}
						transition={{ ease: 'backInOut', duration: 0.5 }}
						className="h-[20px] w-auto"
					>
						<span
							className={`flex h-[20px] items-center ${
								isActive ? 'text-primary' : ''
							}`}
						>
							{children}
						</span>
						<span
							className={`text-primary flex h-[20px] items-center ${
								isActive ? 'text-primary' : ''
							}`}
						>
							{children}
						</span>
					</motion.div>
				)
			}}
		</NavLink>
	)
}
