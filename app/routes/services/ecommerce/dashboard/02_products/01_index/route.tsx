import type { Route } from './+types/route'

import {
	DashboardActions,
	DashboardContent,
	DashboardHeader,
	DashboardSectionWrapper,
	DashboardTitle,
} from '~/routes/papa/dashboard/components/dashboard-wrapper'

export default function ECProductsIndex({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return (
		<DashboardSectionWrapper>
			<DashboardHeader>
				<DashboardTitle title="Products"></DashboardTitle>
				<DashboardActions>
					{/* You may put some buttons here */}
				</DashboardActions>
			</DashboardHeader>
			{/* Your main content goes here */}
			<DashboardContent>Display products list here.</DashboardContent>
		</DashboardSectionWrapper>
	)
}
