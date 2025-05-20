import { SocialLinks } from './Header'

export const Footer = () => {
    return (
        <footer className="py-3 px-6 flex flex-col-reverse items-center justify-end gap-2 lg:flex-row lg:gap-8 border-t border-primary">
            <p className="text-sm text-primary text-pretty text-center ">
                Built by me © 2024 CHIU YIN CHEN somewhere on the 🌏.
            </p>
            <SocialLinks />
        </footer>
    )
}
