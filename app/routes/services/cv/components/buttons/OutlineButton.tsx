import React, { forwardRef, type ReactNode, type Ref } from 'react'

import { twMerge } from 'tailwind-merge'

type Props = {
	children: ReactNode
	className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const OutlineButton = forwardRef<HTMLButtonElement, Props>(
	({ children, className, ...rest }, ref: Ref<HTMLButtonElement>) => {
		return (
			<button
				ref={ref}
				className={twMerge(
					`relative z-0 flex items-center gap-2 overflow-hidden rounded-md border-[1px] 
                      border-primary px-3 md:px-4 py-2 font-medium text-sm
                      text-primary transition-all duration-300
                      
                      before:absolute before:inset-0
                      before:-z-10 before:translate-x-[150%]
                      before:translate-y-[150%] before:scale-[2.5]
                      before:rounded-[100%] before:bg-primary
                      before:transition-transform before:duration-1000
                      before:content-[""]

                      hover:text-primary-foreground
                      hover:before:translate-x-[0%]
                      hover:before:translate-y-[0%]
                      active:scale-95`,
					className,
				)}
				{...rest}
			>
				{children}
			</button>
		)
	},
)

OutlineButton.displayName = 'OutlineButton'
