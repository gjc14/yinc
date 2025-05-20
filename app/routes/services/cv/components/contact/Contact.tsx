import { Link } from 'react-router'

import { LinkedInLogoIcon } from '@radix-ui/react-icons'
import { AtSign } from 'lucide-react'

import Reveal from '../util/Reveal'

export const Contact = () => {
	return (
		<section className="section-wrapper" id="contact">
			<div className="max-w-xl mx-auto border-2 border-secondary px-3.5 py-8 sm:px-8 sm:py-12 rounded-xl">
				<Reveal className="w-full">
					<h4 className="text-4xl md:text-5xl text-center font-black">
						Contact<span className="text-primary">.</span>
					</h4>
				</Reveal>
				<Reveal className="w-full">
					<p className="text-center text-pretty my-3.5 text-muted-foreground leading-relaxed sm:my-6">
						Shoot me an email if you want to connect! You could also find me and
						connect on LinkedIn.{' '}
					</p>
				</Reveal>
				<Reveal className="w-full">
					<>
						<div className="w-full flex">
							<Link
								to="https://www.linkedin.com/in/yinctw"
								target="_blank"
								rel="nofollow"
								className="group relative inline-flex items-center justify-center mx-auto overflow-hidden"
							>
								<span className="z-10 flex items-center justify-center text-xl font-semibold">
									<LinkedInLogoIcon className="w-5 h-5 mr-2" />
									yincctw
								</span>
								<span className="absolute z-0 bottom-0 left-0 w-full h-[50%] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
							</Link>
						</div>
						<div className="w-full flex">
							<Link
								to="mailto:yin@yinc.me"
								className="group relative inline-flex items-center justify-center mx-auto overflow-hidden"
							>
								<span className="z-10 flex items-center justify-center text-xl font-semibold">
									<AtSign className="w-5 h-5 mr-2" />
									yin@yinc.me
								</span>
								<span className="absolute z-0 bottom-0 left-0 w-full h-[50%] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
							</Link>
						</div>
					</>
				</Reveal>
			</div>
		</section>
	)
}
