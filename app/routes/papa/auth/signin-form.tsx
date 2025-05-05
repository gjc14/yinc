import { useEffect, useState } from 'react'
import { Form } from 'react-router'

import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Loading } from '~/components/loading'
import { authClient } from '~/lib/auth/auth-client'

export const SignInForm = () => {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [countDown, setCountDown] = useState(0)
	const sendDisabled = countDown > 0 || isSubmitting

	useEffect(() => {
		if (countDown > 0) {
			const timer = setTimeout(() => {
				setCountDown(prev => prev - 1)
			}, 1000)

			return () => clearTimeout(timer)
		}
	}, [countDown])

	const handleSignIn = async (email: string) => {
		await authClient.signIn.magicLink(
			{
				email: email,
				callbackURL: '/admin',
			},
			{
				onRequest: () => {
					setIsSubmitting(true)
				},
				onSuccess: () => {
					setIsSubmitting(false)
					alert('Magic link has sent to your email!')
				},
				onError: ctx => {
					console.error(ctx.error)
					alert('Error sending magic link: ' + ctx.error.message)
					setIsSubmitting(false)
				},
			},
		)
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Sign in</CardTitle>
				<CardDescription>
					Enter your email below to access admin dashboard.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Form
					id="sign-in"
					className="grid gap-2"
					onSubmit={e => {
						e.preventDefault()
						if (isSubmitting) return
						if (sendDisabled) return

						const formData = new FormData(e.currentTarget)
						const email = formData.get('email') as string
						handleSignIn(email)
						setCountDown(30)
					}}
				>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						name="email"
						placeholder="cyc@email.com"
						required
					/>
				</Form>
			</CardContent>
			<CardFooter>
				<Button
					className="w-full"
					disabled={sendDisabled}
					type="submit"
					form="sign-in"
				>
					{isSubmitting ? (
						<Loading />
					) : sendDisabled ? (
						<span>Wait {countDown} to sign in again</span>
					) : (
						'Sign in with Magic Link'
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
