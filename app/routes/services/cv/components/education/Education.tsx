import { SectionHeader } from '../util/SectionHeader'
import { EducationItem, type EducationProps } from './EducationItem'

export const Education = () => {
	return (
		<section className="section-wrapper" id="education">
			<SectionHeader title="Education" dir="r" />
			{education.map(item => (
				<EducationItem key={item.education} {...item} />
			))}
		</section>
	)
}

const education: EducationProps[] = [
	{
		education: 'National Chengchi University (NCCU)',
		schoolUrl: 'https://www.nccu.edu.tw',
		logo: '/cv/nccu.png',
		degree:
			'Bachelor of Arts (European Languages and Cultures) & Bachelor of Science in Accounting',
		GPA: '3.60/4.30',
		time: 'AUG 2020 - JUN 2025',
		location: 'Taipei, Taiwan 🇹🇼',
		description:
			'Double major program in European Languages and Cultures (Spanish focus) and Accounting, provided a comprehensive foundation of business and the ticket to enter Latin America and Eruope market.',
	},
	{
		education: 'Universidad de los Andes (Uniandes)',
		schoolUrl: 'https://www.uniandes.edu.co',
		logo: '/cv/uniandes.png',
		degree:
			'International Exchange Program (2024-20) - Business Administration',
		GPA: '4.19/5.00',
		time: 'AUG 2024 - DEC 2024',
		location: 'Bogotá, Colombia 🇨🇴',
		description:
			'Successfully completed an exchange program at Universidad de los Andes, expanding my global business perspective. Besides, developed cross-cultural communication skills through coursework and interaction with international peers.',
	},
]
