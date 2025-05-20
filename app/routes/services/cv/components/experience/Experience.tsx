import { SectionHeader } from '../util/SectionHeader'
import { ExperienceItem, type ExperienceProps } from './ExperienceItem'

export const Experience = () => {
	return (
		<section className="section-wrapper" id="experience">
			<SectionHeader title="Work Experience" dir="l" />
			{experience.map(item => (
				<ExperienceItem key={item.company} {...item} />
			))}
		</section>
	)
}

const experience: ExperienceProps[] = [
	{
		company: 'BUBU E-Scooter CO., LTD. (R.O.C. VAT. 93770828)',
		title: 'PM & Developer (Founder & CEO)',
		time: 'JUL 2023 - JUL 2025',
		location: 'Taipei, Taiwan 🇹🇼',
		description: [
			'I built the company from the ground up with two co-founders. Managed all the chores and development tasks, including market analysis, bookkeeping, business plan and product development.',
			'Drafted a business plan, including market competition analysis, product roadmap, and a three-year financial forecast, which resulted in the first project at National Chengchi University that secured the NT$1,000,000 Taipei SiTi Subsidy.',
			'Organized and wrote a comprehensive shared e-scooter sandbox plan about a 2-week activity and a 2-month trial event at NCCU. The university authorities approved the plan after multiple rounds of communication.',
			'Utilized Asana CWM for project management, integrating a time management matrix to effectively prioritize hundreds of tasks involving software development, suppliers, the university, and the government, ensuring all deadlines were met.',

			'Designed, developed, and deployed a rental bot for LINE official account using TypeScript Node.js and Python Flask, integrated APIs and hosted on Google Cloud Run for scalable rental process automation.',
			'Built an official website with TypeScript Remix (a full-stack React framework), TailwindCSS, and MongoDB. Deployed it on Google Cloud Run, ensuring high availability, performance, and cost-efficiency.',
			'Deployed a Python Flask application on Google Compute Engine (Linux), integrated Cloudflare Tunnel for a secure network, and implemented CI/CD with GitHub Actions, reducing server monthly costs from NT$2,000 to NT$0.',

			'Deployed website on Google Cloud Run, where as Python Flask application deployed with customized python script to build CI/CD pipeline on Google Compute Engine (Linux Debian), triggered by GitHub Actions.',
			'In order to connect and communicate to IoT, we are also running a Mosquitto MQTT on Compute Engine.',
			"This project is currently being held in NCCU campus with help of NCCU incubator. If you're interested in our product, please contact me!",
		],
		tech: [
			'Program Management',
			'TypeScript',
			'Python',
			'React Router v7 (Remix v3)',
			'Flask',
			'Tailwind',
			'Google Cloud',
			'Github',
			'MQTT',
			'SYSTEMD',
			'Asana',
			'Ragic',
			'Firebase',
		],
	},
	{
		company:
			'Gabriel & Chris Brothers CO., LTD. (R.O.C. VAT. 83014536) (Dissolution)',
		title: 'Co-founder',
		time: 'FEB 2023 - DEC 2024',
		location: 'Remote ☁️',
		description: [
			'In charge of website and online infrastructure. Managed and built the E-Commerce website and server based on TypeScript Remix v2, MongoDB and Firebase, including CI/CD pipeline, server maintenance, and security.',
			'Design the admin panel to manage both client and product data, as well as payment, logistic, and customized email to fulfill the style and image in data flow math what the company emphasis.',
			'With TapPay APIs and third party logistic APIs to select convenience stores for purchase pick up, I built the in-site checkout process without redirecting to any separate third-party payment service.',
			'Analyzed global market, tested and tried as many tea as posible to select the one more suitable and most profitable for the company not only in Taiwan domestic market, but also for ASEAN and Europe.',
		],
		tech: [
			'Taiwan Tea',
			'TypeScript',
			'Remix v2',
			'MongoDB',
			'Tailwind',
			'Shadcn',
			'Git',
			'Google Cloud',
			'Firebase',
			'Vercel',
			'Tiptap',
			'Resend',
			'TapPay',
		],
	},
]
