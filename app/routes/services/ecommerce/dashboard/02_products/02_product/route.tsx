import type { Route } from './+types/route'

import {
	DashboardActions,
	DashboardContent,
	DashboardHeader,
	DashboardSectionWrapper,
	DashboardTitle,
} from '~/routes/papa/dashboard/components/dashboard-wrapper'

export const loader = async ({ params }: Route.LoaderArgs) => {
	const productId = params.productId
	return { productId }
}

export default function ECProduct({ loaderData }: Route.ComponentProps) {
	return (
		<DashboardSectionWrapper>
			<DashboardHeader>
				<DashboardTitle
					title={`Product ${loaderData.productId}`}
				></DashboardTitle>
				<DashboardActions>
					{/* You may put some buttons here */}
				</DashboardActions>
			</DashboardHeader>
			{/* Your main content goes here */}
			<DashboardContent>
				Display product {loaderData.productId} details here.
			</DashboardContent>
		</DashboardSectionWrapper>
	)
}
