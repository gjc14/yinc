import { useIsMobile } from '~/hooks/use-mobile'

import { LINKS } from './components/links'
import { ThemeSwitcher } from './components/theme-switcher'

export default function Index() {
	const isMobile = useIsMobile()

	return (
		<div className="bg-brand text-foreground relative mx-auto flex min-h-svh w-full flex-col gap-12 overflow-auto p-8 lg:flex-row xl:gap-28 xl:p-24">
			<div className="mb-12 w-full xl:mb-0 xl:w-[500px]">
				<img
					className="border-border h-28 w-28 rounded-full border-2 object-contain xl:h-[184px] xl:w-[184px]"
					src={'https://avatars.githubusercontent.com/u/136115556?v=4&size=256'}
					alt="profile picture"
				/>

				<div className="mt-8">
					<h2 className="font-heading text-3xl sm:text-[44px]">
						CHIU YIN CHEN
					</h2>
					<p className="font-base mt-6 text-base sm:text-xl">
						Hi I'm Yin Chen, I build enterprise software for Asian SMEs.
						Checkout my{' '}
						<a
							className="font-heading underline"
							href="https://github.com/gjc14"
						>
							GitHub
						</a>{' '}
						for more info.
					</p>
				</div>

				<ThemeSwitcher start={isMobile ? 'top left' : 'bottom left'} />
			</div>

			<div
				id="grid-container"
				className="text-foreground grid h-fit w-full grid-cols-1 gap-7 pb-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-3 lg:grid-cols-2 xl:w-1/2 xl:grid-cols-3 xl:pb-16"
			>
				{/* Edit your links in ./components/links.tsx */}
				{Object.keys(LINKS).map(key => {
					return (
						<a
							key={key}
							href={LINKS[key].link}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-brand text-brand-foreground border-brand-foreground inline-flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-5 shadow-[5px_-5px_0px_0px_var(--brand-foreground)] transition-all ease-in-out hover:translate-x-[5px] hover:-translate-y-[5px] hover:shadow-none"
						>
							<div className="relative size-10">{LINKS[key].icon}</div>
							<p className="font-heading mt-3 text-base sm:text-lg">
								{LINKS[key].title}
							</p>
							<p className="font-base mt-1 text-sm sm:text-base">
								{LINKS[key].text}
							</p>
						</a>
					)
				})}
			</div>
		</div>
	)
}
