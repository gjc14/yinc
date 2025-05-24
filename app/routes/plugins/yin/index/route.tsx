import { LINKS } from './links'
import { ThemeSwitcher } from './theme-switcher'

export default function Index() {
	return (
		<div className="text-foreground relative mx-auto h-full w-[700px] max-w-full p-8 md:p-16 xl:w-[1400px]">
			<div className="mb-12 w-full xl:fixed xl:mb-0 xl:w-[500px]">
				<img
					className="border-border h-28 w-28 rounded-full border-2 xl:h-[184px] xl:w-[184px]"
					src={'https://avatars.githubusercontent.com/u/136115556?v=4&size=256'}
					alt="profile picture"
				/>

				<div className="mt-8">
					<h2 className="font-heading text-3xl sm:text-[44px]">
						CHIU YIN CHEN
					</h2>
					<p className="font-base mt-6 text-base sm:text-xl">
						Hi I'm Yin Chen, I build No Code ERP for APAC SMEs. Checkout my{' '}
						<a
							className="font-heading underline"
							href="https://github.com/gjc14"
						>
							GitHub
						</a>{' '}
						for more info.
					</p>
				</div>

				<ThemeSwitcher />
			</div>
			<div className="justify-end xl:flex">
				<div
					id="grid-container"
					className="text-foreground grid w-full grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-10 md:grid-cols-3 xl:w-1/2 xl:pb-16"
				>
					{Object.keys(LINKS).map(key => {
						return (
							<a
								key={key}
								href={LINKS[key].link}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-2xl p-5 flex flex-col bg-brand text-brand-foreground justify-between border-2 border-brand-foreground shadow-[5px_-5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[5px] hover:-translate-y-[5px] hover:shadow-none transition-all ease-in-out cursor-pointer"
							>
								<div className="size-10 relative">{LINKS[key].icon}</div>
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
		</div>
	)
}
