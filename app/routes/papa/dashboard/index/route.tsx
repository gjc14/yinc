import { Link } from 'react-router'

import { Button } from '~/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import {
	DashboardContent,
	DashboardHeader,
	DashboardSectionWrapper,
	DashboardTitle,
} from '~/routes/papa/dashboard/components/dashboard-wrapper'

import { renderServiceLogo } from '../../utils/render-service-logo'
import { getServiceDashboardConfigs } from '../../utils/service-configs'

export default function DashboardIndex() {
	const services = getServiceDashboardConfigs()

	return (
		<DashboardSectionWrapper>
			<DashboardHeader>
				<DashboardTitle title="Services" />
			</DashboardHeader>
			<DashboardContent>
				{services.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 m-auto text-center space-y-6">
						<div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
							<svg
								className="w-12 h-12 text-primary-foreground"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>

						<div className="space-y-2">
							<h3 className="text-xl font-semibold text-primary">
								No Services Available
							</h3>
							<p className="text-muted-foreground max-w-md">
								There are currently no services configured. Services will appear
								here once they're added to your dashboard.
							</p>
						</div>

						<div className="flex gap-3">
							{/* TODO: Add resources */}
							<Button variant="outline" size="sm" asChild>
								<a
									href="https://github.com/gjc14/papa?tab=readme-ov-file#service"
									target="_blank"
									rel="noopener noreferrer"
								>
									Learn More
								</a>
							</Button>
							<Button size="sm">Get Started</Button>
						</div>
					</div>
				) : (
					<TooltipProvider>
						<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 overflow-auto w-full h-fit">
							{services.map((service, index) => (
								<Link
									key={index}
									to={service.pathname}
									className="border rounded-xl w-full h-40 p-5 grid grid-rows-5 items-center gap-2 hover:bg-accent transition-colors cursor-pointer"
								>
									<div className="row-span-2 m-auto rounded-lg overflow-hidden">
										{renderServiceLogo(service.logo, 'lg')}
									</div>
									<div className="row-span-3 flex flex-col justify-start gap-1 min-h-0 overflow-hidden">
										<Tooltip>
											<TooltipTrigger asChild>
												<p className="truncate font-semibold text-center">
													{service.name}
												</p>
											</TooltipTrigger>
											<TooltipContent>
												<p>{service.name}</p>
											</TooltipContent>
										</Tooltip>
										{service.description && (
											<Tooltip>
												<TooltipTrigger asChild>
													<p className="text-sm text-muted-foreground line-clamp-3 text-start text-pretty flex-1">
														{service.description}
													</p>
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">{service.description}</p>
												</TooltipContent>
											</Tooltip>
										)}
									</div>
								</Link>
							))}
						</div>
					</TooltipProvider>
				)}
			</DashboardContent>
		</DashboardSectionWrapper>
	)
}
