import Reveal from '../util/Reveal'

export interface EducationProps {
	education: string
	schoolUrl: string
	logo: string
	degree: string
	time: string
	location: string
	description: string
	GPA?: string
}

export const EducationItem = ({
	education,
	schoolUrl,
	logo,
	degree,
	time,
	location,
	description,
	GPA,
}: EducationProps) => {
	return (
		<div className="mb-6 border-b pb-6 border-muted-foreground">
			<div className="flex flex-col justify-between sm:flex-row sm:items-center gap-1.5 mb-2">
				<Reveal>
					<div className="flex items-center">
						<img
							src={logo}
							alt={education}
							className="w-5 h-5 mr-3 sm:w-6 sm:h-6"
						/>
						<a
							href={schoolUrl}
							target="_blank"
							rel="noreferrer"
							className="font-bold text-lg text-wrap underline-offset-2 hover:underline sm:text-xl"
						>
							{education}
						</a>
					</div>
				</Reveal>
				<Reveal>
					<span>{time}</span>
				</Reveal>
			</div>

			<div className="flex flex-col justify-between sm:flex-row sm:items-center gap-1.5 mb-4">
				<Reveal>
					<span className="text-secondary font-bold">{degree}</span>
				</Reveal>
				<Reveal>
					<span>{location}</span>
				</Reveal>
			</div>
			<Reveal>
				<p className="mb-6 text-muted-foreground leading-relaxed">
					{description}
				</p>
			</Reveal>
			{GPA && (
				<Reveal>
					<div className="flex flex-wrap gap-2">
						<p className="text-primary font-semibold">GPA - {GPA}</p>
					</div>
				</Reveal>
			)}
		</div>
	)
}
