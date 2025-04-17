/**
 * Display progress cards for file uploads. Tracking upload progress.
 */
import { useState } from 'react'

import { Check, ChevronsUpDown, X } from 'lucide-react'

import AnimatedCircularProgressBar from '~/components/ui/animated-circular-progress-bar'
import { Button } from '~/components/ui/button'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '~/components/ui/collapsible'

import type { UploadState } from '../utils'

export const ProgressCard = ({
	uploadProgress,
}: {
	uploadProgress: UploadState
}) => {
	const [hiddenProgressCards, setHiddenProgressCards] = useState<Set<string>>(
		new Set(),
	)
	const visibleUploadProgress = Object.entries(uploadProgress).filter(
		([key]) => !hiddenProgressCards.has(key),
	)

	if (visibleUploadProgress.length === 0) {
		return null
	}
	return (
		<Collapsible
			className="absolute right-3 bottom-3 md:w-[300px] space-y-2"
			defaultOpen
			onClick={e => e.stopPropagation()}
		>
			{/* Upload progress card */}
			<CollapsibleTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full flex items-center justify-between space-x-4 py-0 px-4 border bg-muted"
					onClick={e => e.stopPropagation()}
				>
					<h4 className="text-sm font-semibold">
						{visibleUploadProgress.length}{' '}
						{visibleUploadProgress.length > 1 ? 'files' : 'file'} created
					</h4>
					<ChevronsUpDown className="h-4 w-4" />
					<span className="sr-only">Toggle</span>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="space-y-2">
				{visibleUploadProgress.map(([key, upload]) => {
					const { file, progress, status, error } = upload

					return (
						<div
							key={key}
							className="flex items-center px-5 py-3.5 border rounded-md bg-muted"
						>
							<div className="grow max-w-[calc(100%-2rem)] gap-0.5">
								{/* File name */}
								<div
									className="flex items-center justify-start px-0.5 gap-0"
									title={`${file}`}
								>
									<span className="text-sm font-medium truncate mr-1">
										{file.name.split('.')[0]}
									</span>
									<span className="text-sm font-medium shrink-0">
										.{file.name.split('.')[1]}
									</span>
								</div>

								{/* Error message */}
								{error && (
									<p className="text-sm font-medium text-red-500 dark:text-red-600">
										{error}
									</p>
								)}
							</div>

							<div className="ml-3 mr-1 flex shrink-0 items-center">
								{status === 'completed' ? (
									<Button
										variant="outline"
										size="icon"
										className="w-5 h-5 rounded-full bg-lime-500 dark:bg-lime-600 hover:bg-transparent dark:hover:bg-transparent hover:border border-0 border-primary transition-colors duration-200 group"
										onClick={e => {
											e.stopPropagation()
											setHiddenProgressCards(prev => {
												const newSet = new Set(prev)
												newSet.add(key)
												return newSet
											})
										}}
									>
										<Check className="h-4 w-4 group-hover:hidden" />
										<X className="h-4 w-4 hidden group-hover:block" />
										<span className="sr-only">
											{status === 'completed'
												? 'Mark as incomplete'
												: 'Mark as complete'}
										</span>
									</Button>
								) : status === 'error' ? (
									<Button
										variant="outline"
										size="icon"
										className="w-5 h-5 rounded-full bg-red-500 dark:bg-red-600 hover:bg-transparent dark:hover:bg-transparent hover:border border-0 border-primary transition-colors duration-200 group"
										onClick={e => {
											e.stopPropagation()
											setHiddenProgressCards(prev => {
												const newSet = new Set(prev)
												newSet.add(key)
												return newSet
											})
										}}
									>
										<X className="h-4 w-4" />
										<span className="sr-only">{status}</span>
									</Button>
								) : (
									<div className="w-5 h-5 rounded-full border-2 border-muted relative">
										<AnimatedCircularProgressBar
											className="w-full h-full flex items-center justify-center text-xs animate-pulse"
											max={105}
											min={0}
											value={progress}
											showPercent={false}
											strokeWidth={15}
											gaugePrimaryColor="rgb(79 70 229)"
											gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
										/>
									</div>
								)}
							</div>
						</div>
					)
				})}
			</CollapsibleContent>
		</Collapsible>
	)
}
