import type { MetaFunction } from 'react-router'

import { About } from '../components/about/About'
import { Contact } from '../components/contact/Contact'
import { Education } from '../components/education/Education'
import { Experience } from '../components/experience/Experience'
import Hero from '../components/hero/Hero'
import { Leadership } from '../components/leadership/Leadership'
import { Footer } from '../components/nav/Footer'
import { Header } from '../components/nav/Header'
import { SideBar } from '../components/nav/SideBar'
import { Projects } from '../components/projects/Projects'

export const meta: MetaFunction = () => {
	return [
		{ title: 'CHIU YIN CHEN' },
		{
			name: 'description',
			content:
				"I'm a developer and entrepreneur majored in Spanish and Accounting, based in Taiwan.",
		},
	]
}

export default function CV() {
	return (
		<div className="grid grid-cols-[48px_1fr] sm:grid-cols-[54px_1fr]">
			<SideBar />
			<main>
				<Header />
				<div className="mx-auto max-w-5xl px-4 md:px-8 pb-24">
					<Hero />
					<About />
					<Projects />
					<Experience />
					<Education />
					<Leadership />
					<Contact />
				</div>
				<Footer />
			</main>
		</div>
	)
}
