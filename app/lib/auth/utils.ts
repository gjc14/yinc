import type { Resend } from 'resend'

import MagicLinkEmail from '~/components/email/magic-link'
import OtpEmail from '~/components/email/otp-email'
import WelcomeEmail from '~/components/email/welcome-email'

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

export const sendVerifyLink = async ({
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

	const from = `🔓${appName} Verify <${process.env.AUTH_EMAIL}>`

	const { error } = await emailInstance.emails.send({
		from,
		to: [email],
		subject: '點擊連結以驗證您的帳號！Click the link to verify your email',
		react: WelcomeEmail({
			appName: appName,
			logoUrl: process.env.VITE_BASE_URL + '/logo.png',
			userFirstname: email.split('@')[0],
			verifyLink: url,
		}),
	})
	if (error) {
		console.error(error)
		throw new Error('Error when sending verify link email')
	}
}

/**
 * Send the OTP to the user's email address
 */
export const sendSignInOTP = async ({
	email,
	otp,
	expireIn,
	emailInstance,
}: {
	email: string
	otp: string
	expireIn: number
	emailInstance: Resend
}): Promise<void> => {
	const appName = process.env.APP_NAME ?? 'PAPA'
	const from = `${appName} <${process.env.AUTH_EMAIL}>`

	const { error } = await emailInstance.emails.send({
		from,
		to: [email],
		subject: '輸入您的 OTP 一次性密碼登入！Enter your OTP to sign in',
		react: OtpEmail({
			otp,
			expireIn,
			companyName: appName,
			username: email.split('@')[0],
		}),
	})
	if (error) {
		console.error(error)
		throw new Error('Error when sending magic link email')
	}
}
