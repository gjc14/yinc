import Reveal from '../util/Reveal'
import { OutlineButton } from '../buttons/OutlineButton'

const Hero = () => {
    return (
        <section className="text-slat-100 overflow-hidden py-24 md:py-32">
            <div className="relative">
                <div className="pointer-events-none relative z-10">
                    <Reveal>
                        <h1 className="pointer-events-auto text-4xl sm:text-6xl font-black text-primary md:text-8xl">
                            Chiu Yin Chen?
                        </h1>
                    </Reveal>
                    <Reveal>
                        <h2 className="pointer-events-auto my-2 text-xl sm:text-2xl text-muted-foreground md:my-4 md:text-4xl">
                            I'm Yin Chen, an{' '}
                            <span className="font-semibold text-secondary">
                                Entrepreneur
                            </span>{' '}
                            and a Dreamer
                        </h2>
                    </Reveal>
                    <Reveal>
                        <p className="pointer-events-auto leading-relaxed md:leading-relaxed max-w-xl text-sm text-muted-foreground md:text-base">
                            I'm an entrepreneur and full stack web developer
                            from Taiwan. Over the past{' '}
                            {new Date().getFullYear() - 2023}{' '}
                            {new Date().getFullYear() - 2023 > 1
                                ? 'years'
                                : 'year'}
                            , I've been building, deploying, and scaling
                            software for my own startup projects. I'm always
                            looking for new opportunities to learn and grow. If
                            you also love technology, let's connect! 🚀
                        </p>
                    </Reveal>
                    <Reveal>
                        <OutlineButton
                            onClick={() => {
                                document
                                    .getElementById('contact')
                                    ?.scrollIntoView()
                            }}
                            className="pointer-events-auto before:bg-secondary hover:text-primary-foreground mt-4 text-primary border-secondary md:mt-6"
                        >
                            Contact Me
                        </OutlineButton>
                    </Reveal>
                </div>
                {/* <DotGrid /> */}
            </div>
        </section>
    )
}

export default Hero
