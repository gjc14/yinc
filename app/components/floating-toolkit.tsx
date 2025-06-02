import { useState } from 'react'
import { useNavigate } from 'react-router'

import { DashboardIcon } from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp, HelpCircle, Loader, LogOut, PanelTop } from 'lucide-react'

import { authClient } from '~/lib/auth/auth-client'
import { cn } from '~/lib/utils'

interface ToolboxItemProps {
	icon: React.ReactNode
	label: string
	onClick?: () => void
}

const ToolboxItem = ({ icon, label, onClick }: ToolboxItemProps) => {
	return (
		<button
			className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
			onClick={onClick}
		>
			<span className="text-gray-500">{icon}</span>
			<span>{label}</span>
		</button>
	)
}

export function FloatingToolkit() {
	const [isOpen, setIsOpen] = useState(false)
	const navigate = useNavigate()
	const { data, isPending } = authClient.useSession()

	const toolboxItems = [
		{
			icon: <PanelTop className="size-4" />,
			label: 'View Website',
			onClick: () => navigate('/'),
		},
		{
			icon: <DashboardIcon className="size-4" />,
			label: 'Go to Dashboard',
			onClick: () => navigate('/admin'),
		},
		{
			icon: <HelpCircle className="size-4" />,
			label: 'Help & Resources',
			onClick: () => alert('Not implemented yet'),
		},
		{
			icon: <LogOut className="size-4" />,
			label: 'Sign Out',
			onClick: () => authClient.signOut(),
		},
	]

	if (isPending) {
		return (
			<div className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg">
				<Loader className="size-8 animate-spin text-white dark:text-black" />
			</div>
		)
	}

	if (data?.user.role === 'admin') {
		return (
			<div
				className="fixed bottom-6 right-6 z-50"
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
			>
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{ duration: 0.2 }}
							className="absolute bottom-16 right-0 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2 min-w-[200px] flex flex-col"
						>
							{toolboxItems.map((item, index) => (
								<ToolboxItem
									key={index}
									icon={item.icon}
									label={item.label}
									onClick={item.onClick}
								/>
							))}
						</motion.div>
					)}
				</AnimatePresence>

				<motion.button
					className={cn(
						'flex items-center justify-center w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg',
						isOpen && 'bg-gray-800 dark:bg-gray-200',
					)}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<ChevronUp
						size={20}
						className={cn(
							'transition-transform duration-200',
							isOpen && 'rotate-180',
						)}
					/>
				</motion.button>
			</div>
		)
	}
}
