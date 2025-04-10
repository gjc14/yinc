import { Resend } from 'resend'

let emailInstance: Resend | null = null
if (process.env.RESEND_API_KEY && process.env.AUTH_EMAIL) {
	emailInstance = new Resend(process.env.RESEND_API_KEY)
} else {
	console.warn(
		'RESEND_API_KEY and AUTH_EMAIL are required, email sending is now disabled',
	)
}

export { emailInstance }
