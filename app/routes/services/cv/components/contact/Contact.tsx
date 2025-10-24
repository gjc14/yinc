import { Link } from 'react-router'

import { LinkedInLogoIcon } from '@radix-ui/react-icons'
import { AtSign } from 'lucide-react'

import Reveal from '../util/Reveal'

export const Contact = () => {
	return (
		<section className="section-wrapper" id="contact">
			<div className="border-secondary mx-auto max-w-xl rounded-xl border-2 px-3.5 py-8 sm:px-8 sm:py-12">
				<Reveal className="w-full">
					<h4 className="text-center text-4xl font-black md:text-5xl">
						Contact<span className="text-primary">.</span>
					</h4>
				</Reveal>
				<Reveal className="w-full">
					<p className="text-muted-foreground my-3.5 text-center leading-relaxed text-pretty sm:my-6">
						Shoot me an email if you want to connect! You could also find me and
						connect on LinkedIn.{' '}
					</p>
				</Reveal>
				<Reveal className="w-full">
					<>
						<div className="flex w-full">
							<Link
								to="https://www.linkedin.com/in/yinctw"
								target="_blank"
								rel="nofollow"
								className="group relative mx-auto inline-flex items-center justify-center overflow-hidden"
							>
								<span className="z-10 flex items-center justify-center text-xl font-semibold">
									<LinkedInLogoIcon className="mr-2 h-5 w-5" />
									yincctw
								</span>
								<span className="bg-secondary absolute bottom-0 left-0 z-0 h-[50%] w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
							</Link>
						</div>
						<div className="flex w-full">
							<Link
								to="mailto:cyc@yinc.tw"
								className="group relative mx-auto inline-flex items-center justify-center overflow-hidden"
							>
								<span className="z-10 flex items-center justify-center text-xl font-semibold">
									<AtSign className="mr-2 h-5 w-5" />
									cyc@yinc.tw
								</span>
								<span className="bg-secondary absolute bottom-0 left-0 z-0 h-[50%] w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
							</Link>
						</div>
					</>
				</Reveal>
			</div>
		</section>
	)
}
