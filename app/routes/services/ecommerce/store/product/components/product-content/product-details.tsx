import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'

import type { ProductContentProps } from '.'

export const ProductDetails = ({
	details,
}: {
	details: ProductContentProps['product']['details']
}) => {
	const [activeTab, setActiveTab] = useState(0)

	if (!details || details.length === 0) return null

	return (
		<div>
			<Separator />
			<div className="mt-8 mb-6 flex w-full gap-6 overflow-scroll border-b">
				{details.map((detail, idx) => (
					<Button
						key={idx}
						onClick={() => setActiveTab(idx)}
						className={`cursor-pointer rounded-none border-b-2 px-0 pb-5 text-sm font-medium transition-colors hover:no-underline ${
							activeTab === idx
								? 'border-primary'
								: 'text-primary/70 hover:text-primary border-transparent'
						}`}
						variant={'link'}
					>
						{detail.title}
					</Button>
				))}
			</div>
			<div className="prose prose-sm max-w-none">
				<p className="text-primary/90 leading-relaxed whitespace-pre-line">
					{details[activeTab].content}
				</p>
			</div>
		</div>
	)
}
