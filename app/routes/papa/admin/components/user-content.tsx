import { useFetcher } from 'react-router'

import { Loader2, Save } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { user } from '~/lib/db/schema'

type User = typeof user.$inferSelect

export const UserContent = ({
	user,
	open,
	setOpen,
	action,
	method,
}: {
	user: User
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	action: string
	method: 'PUT' | 'POST'
}) => {
	const fetcher = useFetcher()
	const isSubmitting =
		fetcher.formAction === action && fetcher.state === 'submitting'

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-scroll">
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you're done. Last
						updated on {user.updatedAt.toLocaleString('zh-TW')}
					</DialogDescription>
				</DialogHeader>
				<fetcher.Form
					id="user-content"
					className="grid gap-4 py-4"
					onSubmit={e => {
						e.preventDefault()
						const formData = new FormData(e.currentTarget)

						const checkboxFields = ['emailVerified', 'banned']
						checkboxFields.forEach(field => {
							const isChecked = formData.get(field) === 'on'
							formData.set(field, isChecked.toString())
						})

						fetcher.submit(formData, {
							method,
							action,
						})
					}}
				>
					<input type="hidden" name="id" defaultValue={user.id} />
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="email" className="text-right">
							Email
						</Label>
						<Input
							id="email"
							name="email"
							defaultValue={user.email}
							className="col-span-3"
							placeholder="ur@e.mail"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input
							id="name"
							name="name"
							defaultValue={user.name ?? undefined}
							className="col-span-3"
							placeholder="Your name"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="image" className="text-right">
							Image
						</Label>
						<Input
							id="image"
							name="image"
							defaultValue={user.image ?? undefined}
							className="col-span-3"
							placeholder="e.g. https://placecats.com/300/200"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="role" className="text-right">
							Role
						</Label>
						<Select name="role" defaultValue={user.role ?? 'user'}>
							<SelectTrigger className="col-span-3">
								<SelectValue id="role" placeholder="what's your role?" />
							</SelectTrigger>
							<SelectContent>
								{['user', 'admin'].map(role => (
									<SelectItem key={role} value={role}>
										{role}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="emailVerified" className="text-right col-span-1">
							Verified
						</Label>
						<Checkbox
							id="emailVerified"
							name="emailVerified"
							defaultChecked={user.emailVerified}
							className="col-span-3 ml-2"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="banned" className="text-right col-span-1">
							Banned
						</Label>
						<Checkbox
							id="banned"
							name="banned"
							defaultChecked={user.banned ?? false}
							className="col-span-3 ml-2"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="banReason" className="text-right">
							Ban reason
						</Label>
						<Input
							id="banReason"
							name="banReason"
							defaultValue={user.banReason ?? undefined}
							className="col-span-3"
							placeholder="Why the user is banned?"
						/>
					</div>
					{/* TODO: Ban Expires */}
				</fetcher.Form>
				<DialogFooter>
					<Button form="user-content" type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<Save size={16} />
						)}
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
