import type { Resend } from 'resend'

import MagicLinkEmail from '~/components/email/magic-link'

export const sendMagicLink = async ({
	email,
	url,
	token,
	emailInstance,
}: {
	email: string
	url: string
	token: string
	emailInstance: Resend
}): Promise<void> => {
	const appName = process.env.APP_NAME ?? 'PAPA'
	const from = `🪄${appName} Magic Link <${process.env.AUTH_EMAIL}>`

	const { error } = await emailInstance.emails.send({
		from,
		to: [email],
		subject: '點擊魔法連結以登入您的帳號！Click the link to sign in',
		react: MagicLinkEmail({ magicLink: url }),
	})
	if (error) {
		console.error(error)
		throw new Error('Error when sending magic link email')
	}
}
