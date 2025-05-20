import { Badge } from '~/components/ui/badge'
import Reveal from '../util/Reveal'

export interface ExperienceProps {
    company: string
    title: string
    time: string
    location: string
    description: string[]
    tech: string[]
}

export const ExperienceItem = ({
    company,
    title,
    time,
    location,
    description,
    tech,
}: ExperienceProps) => {
    return (
        <div className="mb-6 border-b pb-6 border-muted-foreground">
            <div className="flex flex-col sm:items-center justify-between mb-2 sm:flex-row">
                <Reveal>
                    <span className="font-bold text-base sm:text-xl">
                        {company}
                    </span>
                </Reveal>
                <Reveal>
                    <span className="text-sm sm:text-base">{time}</span>
                </Reveal>
            </div>

            <div className="flex items-center justify-between mb-4">
                <Reveal>
                    <span className="text-secondary font-bold text-sm sm:text-base">
                        {title}
                    </span>
                </Reveal>
                <Reveal>
                    <span className="text-sm sm:text-base">{location}</span>
                </Reveal>
            </div>
            <Reveal>
                <ul className="mb-6 ml-5 text-muted-foreground text-pretty leading-relaxed list-outside list-disc">
                    {description.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </Reveal>
            <Reveal>
                <div className="flex flex-wrap gap-2">
                    {tech.map(item => (
                        <Badge variant={'secondary'} key={item}>
                            {item}
                        </Badge>
                    ))}
                </div>
            </Reveal>
        </div>
    )
}
