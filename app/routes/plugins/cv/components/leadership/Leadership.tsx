import { SectionHeader } from '../util/SectionHeader'
import { LeadershipItem, type LeadershipProps } from './LeadershipItem'

export const Leadership = () => {
	return (
		<section className="section-wrapper" id="leadership">
			<SectionHeader title="Leadership" dir="l" />
			{leadership.map(item => (
				<LeadershipItem key={item.company} {...item} />
			))}
		</section>
	)
}

const leadership: LeadershipProps[] = [
	{
		company: 'BUBU E-Scooter',
		title: 'Founder & CEO',
		time: 'JUL 2023 - JUL 2025',
		description: [
			'Managed system development and successfully secured Taipei SiTi 1 Million Subsidy using Asana CWM.',
			'Cooperated with NCCU Incubation Center to host three workshops for 2024 Hult Prize at NCCU, for more than 100 attendees in total.',
			'Prepared a 3-year financial forecast, business plans, annual budgets, financial statements, and managed bookkeeping.',
		],
		tech: ['Asana', 'Trello', 'Google Workspace', 'Ragic', 'Bookkeeping'],
	},
	{
		company: 'NCCU Mutual Fund Club',
		title: 'CFO',
		time: 'JUL 2022 - JUN 2023',
		description: [
			'Analyzed macroeconomic statistics and company financial reports to generate industry research reports.',
			'Prepared semiannual budgets and financial statements, also in charge of expenditures and bookkeeping for an account of NT$200,000.',
			'Managed club administration and general affairs, including venue scheduling, two events for recruiting, the planning of midterm and final research presentations, and inventory management.',
		],
		tech: ['Microsoft Excel', 'Google Workspace', 'Bookkeeping'],
	},
	{
		company: 'NCCU EuroCamp 2022',
		title: 'Chief Coordinator',
		time: 'JAN 2022 - JUL 2022',
		description: [
			'Organized and led a team of 40 to execute a successful 5-day on-campus event for 60 attendees, adhering to additional health regulations implemented during the pandemic.',
			'Utilized Python learned from a Python programming course in freshman to automate email sending process to 120+ applicants.',
			'Authored and scheduled promotional content for the department and the event, including Instagram and Facebook, increasing total reach by 17% on Meta platforms.',
		],
		tech: ['Python', 'Google Scripts', 'Meta'],
	},
	{
		company: 'NCCU DELC Student Association',
		title: 'Head of General Affairs',
		time: 'JUL 2021 - JUN 2022',
		description: [
			'Introduced and implemented double-entry bookkeeping to improve financial accuracy and transparency.',
			'Prepared budgets, financial statements, and managed expenditures for an NT$500,000 account.',
			'Helped organize and execute events for students of the department.',
		],
		tech: ['Google Workspace', 'Bookkeeping'],
	},
]
