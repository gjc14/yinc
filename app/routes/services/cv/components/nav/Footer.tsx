import { SocialLinks } from './Header'

export const Footer = () => {
	return (
		<footer className="border-primary flex flex-col-reverse items-center justify-end gap-2 border-t px-6 py-3 lg:flex-row lg:gap-8">
			<p className="text-primary text-center text-sm text-pretty">
				Built by me © {new Date().getFullYear()} CHIU YIN CHEN somewhere on the
				🌏.
			</p>
			<SocialLinks />
		</footer>
	)
}
