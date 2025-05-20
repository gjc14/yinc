import { ArrowRight } from 'lucide-react'

import { SocialLinks } from '../nav/Header'
import Reveal from '../util/Reveal'
import { SectionHeader } from '../util/SectionHeader'
import { Skills } from './Skills'

export const About = () => {
	return (
		<section id="about" className="section-wrapper">
			<SectionHeader title="About" dir="l" />
			<div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
				<div className="space-y-4">
					<Reveal>
						<p className="leading-relaxed text-muted-foreground">
							<span className="text-accent-foreground px-2 rounded font-bold mr-1 float-left text-5xl">
								H
							</span>
							ey! I&apos;m Chiu Yin Chen, an entrepreneur and full-stack
							developer from Taiwan 🇹🇼. BUBU E-Scooter is the project I am
							currently leading. I'm always open to connecting with others
							interested in SaaS, so don't hesitate to reach out if you also
							love technology!
						</p>
					</Reveal>
					<Reveal>
						<p className="leading-relaxed text-muted-foreground">
							Currently, I am building Papa (Potato in Spanish), a SaaS platform
							tailored for SMBs and startups. Papa provides customizable website
							with React and Tailwind CSS, CMS, Accounting Information System,
							which is built with a helpful AI agent to help organize all
							entries and accounts, and a No-Code Database. Besides, Papa offers
							all the Collaborative Work Management tools you needto help
							spinning up your business ASAP. Papa aims to offer an affordable,
							reliable, and modern platform that streamlines business operations
							for entities throughout Asia.
						</p>
					</Reveal>
					<Reveal>
						<p className="leading-relaxed text-muted-foreground">
							Beyond technology, I am passionate about travel and cultural
							exploration. My life goal is to experience as much of the world as
							possible. In the past 6 months, I lived in Bogotá, Colombia 🇨🇴, as
							an exchange student at Universidad de los Andes representing
							National Chengchi University.
						</p>
					</Reveal>
					<Reveal>
						<p className="leading-relaxed text-muted-foreground">
							Moreover, I'm a huge fan of coffee and tea. Which was one of the
							reasons I chose Colombia for my exchange program.
						</p>
					</Reveal>
					<Reveal>
						<p className="leading-relaxed text-muted-foreground">
							More about me? I'm pursuing a double major degree in European
							Languages and Cultures and Accounting at National Chengchi
							University in Taipei. After gaining some professional experience
							in technology, I plan to pursue a master's degree in a tech or
							business-related field outside of Taiwan.
						</p>
					</Reveal>
					<Reveal>
						<div className="flex items-center gap-6">
							<div className="flex items-center gap-3 text-sm text-accent-foreground">
								<span>My links</span>
								<ArrowRight className="w-3.5 h-3.5" />
							</div>
							<SocialLinks />
						</div>
					</Reveal>
				</div>
				<Skills />
			</div>
		</section>
	)
}
