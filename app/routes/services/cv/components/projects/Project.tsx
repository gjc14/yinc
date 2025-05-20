import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

import { SquareArrowOutUpRight } from 'lucide-react'
import { motion, useAnimation, useInView } from 'motion/react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'

import { Github } from '../../icons/github'
import Reveal from '../util/Reveal'

export interface ProjectProps {
	modalContent: React.ReactNode
	description: React.ReactNode
	projectLinks?: string[]
	imgSrc: string
	tech: string[]
	title: string
	codeBases?: string[]
}

export const Project = ({
	modalContent,
	projectLinks,
	description,
	imgSrc,
	title,
	codeBases,
	tech,
}: ProjectProps) => {
	const [hovered, setHovered] = useState(false)

	const controls = useAnimation()

	const ref = useRef(null)
	const isInView = useInView(ref, { once: true })

	useEffect(() => {
		if (isInView) {
			controls.start('visible')
		} else {
			controls.start('hidden')
		}
	}, [isInView, controls])

	return (
		<Dialog>
			<DialogContent className="max-h-[85vh] min-w-[50vw] overflow-scroll">
				<DialogHeader>
					<DialogTitle>
						<img
							className="w-full"
							src={imgSrc}
							alt={`An image of the ${title} project.`}
						/>
					</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<div className="h-full overflow-scroll py-3 px-3.5 bg-muted rounded-md">
					<h4 className="text-3xl font-bold mb-2">{title}</h4>
					<div className="flex flex-wrap gap-2 text-sm text-secondary font-semibold mb-6">
						{tech.join(' - ')}
					</div>

					<div className="space-y-4 leading-relaxed text-sm text-muted-foreground">
						{modalContent}
					</div>

					{(codeBases && codeBases.length > 0) ||
					(projectLinks && projectLinks.length > 0) ? (
						<div className="mt-6">
							<p className="font-bold mb-2 text-xl">
								Project Links
								<span className="text-secondary">.</span>
							</p>
							<div className="flex items-center gap-4 text-sm">
								{codeBases &&
									codeBases.length > 0 &&
									codeBases.map((code, index) => (
										<Link
											key={index}
											target="_blank"
											rel="nofollow"
											className="text-muted-foreground hover:text-accent-foreground transition-colors flex items-center gap-1"
											to={code}
										>
											<Github /> Source Code
										</Link>
									))}
								{projectLinks &&
									projectLinks.length > 0 &&
									projectLinks.map((link, index) => (
										<Link
											key={index}
											target="_blank"
											rel="nofollow"
											className="text-muted-foreground hover:text-accent-foreground transition-colors flex items-center gap-1"
											to={link}
										>
											<SquareArrowOutUpRight className="w-3.5 h-3.5" /> Live
											Project
											{projectLinks.length > 1 && ` ${index + 1}`}
										</Link>
									))}
							</div>
						</div>
					) : null}
				</div>
			</DialogContent>

			<motion.div
				ref={ref}
				variants={{
					hidden: { opacity: 0, y: 100 },
					visible: { opacity: 1, y: 0 },
				}}
				initial="hidden"
				animate={controls}
				transition={{ duration: 0.75 }}
			>
				<DialogTrigger asChild>
					<div
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
						className="w-full aspect-video bg-muted cursor-pointer relative rounded-lg overflow-hidden"
					>
						<img
							src={imgSrc}
							alt={`An image of the ${title} project.`}
							style={{
								width: hovered ? '90%' : '85%',
								rotate: hovered ? '2deg' : '0deg',
							}}
							className="w-[85%] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 transition-all rounded"
						/>
					</div>
				</DialogTrigger>
				<div className="mt-6">
					<Reveal className="w-full">
						<div className="flex items-center gap-2 w-full">
							<h4 className="font-bold text-lg shrink-0 max-w-[calc(100%_-_150px)]">
								{title}
							</h4>
							<div className="w-full h-[1px] bg-muted-foreground" />

							{codeBases && (
								<Link to={codeBases[0]} target="_blank" rel="nofollow">
									<Github />
								</Link>
							)}

							{projectLinks && (
								<Link to={projectLinks[0]} target="_blank" rel="nofollow">
									<SquareArrowOutUpRight className="w-3.5 h-3.5" />
								</Link>
							)}
						</div>
					</Reveal>
					<Reveal>
						<div className="flex flex-wrap gap-4 font-semibold text-sm text-secondary my-2">
							{tech.join(' - ')}
						</div>
					</Reveal>
					<Reveal>
						<div className="text-muted-foreground leading-relaxed">
							{description}
							<DialogTrigger asChild>
								<span className="inline-block text-sm text-accent-foreground cursor-pointer hover:underline">
									Learn more {'>'}
								</span>
							</DialogTrigger>
						</div>
					</Reveal>
				</div>
			</motion.div>
		</Dialog>
	)
}
