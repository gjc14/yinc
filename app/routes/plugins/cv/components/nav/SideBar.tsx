import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'

export const SideBar = () => {
	const [selected, setSelected] = useState('')

	useEffect(() => {
		const sections = document.querySelectorAll('.section-wrapper')

		// When the the section is 50% in view, set the selected state to the id of the section
		const options = {
			rootMargin: '-50% 0px -50% 0px',
		}

		const callback = (entries: any) => {
			entries.forEach((entry: any) => {
				if (entry.isIntersecting) {
					setSelected(entry.target.id)
				}
			})
		}

		const observer = new IntersectionObserver(callback, options)
		sections.forEach(section => observer.observe(section))
	}, [])

	return (
		<nav className="no-scrollbar bg-primary-foreground h-screen sticky top-0 left-0 z-20 inline-flex flex-col items-center border-r border-primary overflow-y-scroll">
			<span className="shrink-0 text-lg text-primary font-black leading-[1] size-10 flex items-center justify-center my-4">
				Y<span className="hidden sm:block">inc</span>
				<span className="text-secondary">.</span>
			</span>
			<div className="[writing-mode:vertical-lr] my-3 md:my-5">
				<NavLink
					to="#about"
					className={`${
						selected === 'about' ? 'bg-secondary' : 'bg-transparent'
					} py-2 px-1.5 sm:px-2 rounded-md text-secondary-foreground transition-all duration-200`}
				>
					About
				</NavLink>
			</div>
			<div className="[writing-mode:vertical-lr] my-3 md:my-5">
				<NavLink
					to="#projects"
					className={`${
						selected === 'projects' ? 'bg-secondary' : 'bg-transparent'
					} p-1.5 sm:p-2 rounded-md text-secondary-foreground transition-all duration-200`}
				>
					Projects
				</NavLink>
			</div>
			<div className="[writing-mode:vertical-lr] my-3 md:my-5">
				<NavLink
					to="#experience"
					className={`${
						selected === 'experience' ? 'bg-secondary' : 'bg-transparent'
					} p-1.5 sm:p-2 rounded-md text-secondary-foreground transition-all duration-200`}
				>
					Exp.
				</NavLink>
			</div>
			<div className="[writing-mode:vertical-lr] my-3 md:my-5">
				<NavLink
					to="#education"
					className={`${
						selected === 'education' ? 'bg-secondary' : 'bg-transparent'
					} p-1.5 sm:p-2 rounded-md text-secondary-foreground transition-all duration-200`}
				>
					Edu.
				</NavLink>
			</div>
			<div className="[writing-mode:vertical-lr] my-3 md:my-5">
				<NavLink
					to="#contact"
					className={`${
						selected === 'contact' ? 'bg-secondary' : 'bg-transparent'
					} p-1.5 sm:p-2 rounded-md text-secondary-foreground transition-all duration-200`}
				>
					Contact
				</NavLink>
			</div>
		</nav>
	)
}
