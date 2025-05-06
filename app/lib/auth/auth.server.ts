/**
 * This auth module is dedicated to the admin panel.
 */
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import {
	admin as adminPlugin,
	emailOTP,
	organization,
} from 'better-auth/plugins'

import { db } from '~/lib/db/db.server'

import { emailInstance } from '../utils/email'
import { ac, admin, user } from './permissions'
import { sendSignInOTP, sendVerifyLink } from './utils'

const appName = process.env.APP_NAME || 'PAPA'
const baseURL =
	process.env.NODE_ENV === 'production'
		? process.env.VITE_BASE_URL || 'http://localhost:5173'
		: 'http://localhost:5173'

const otpExpireIn = 60 * 5 // 5 minutes

export const auth = betterAuth({
	appName,
	baseURL,
	database: drizzleAdapter(db, {
		provider: 'pg',
	}),
	emailAndPassword: {
		enabled: false,
	},
	emailVerification: {
		sendOnSignUp: true,
		...(emailInstance
			? {
					sendVerificationEmail: async ({ user, url, token }, request) => {
						await sendVerifyLink({
							email: user.email,
							token: token,
							url: url,
							emailInstance: emailInstance!,
						})
					},
				}
			: {}),
	},

	plugins: [
		adminPlugin({
			ac,
			roles: {
				admin,
				user,
			},
		}),
		...(emailInstance
			? [
					// magicLink({
					// 	sendMagicLink: async ({ email, token, url }, request) => {
					// 		sendMagicLink({
					// 			email,
					// 			url,
					// 			token,
					// 			emailInstance: emailInstance!,
					// 		})
					// 	},
					// 	disableSignUp: true,
					// }),
					emailOTP({
						expiresIn: otpExpireIn, // 5 minutes
						async sendVerificationOTP({ email, otp, type }) {
							console.log('sendVerificationOTP', email, otp, type)
							switch (type) {
								case 'sign-in':
									await sendSignInOTP({
										email,
										otp,
										expireIn: otpExpireIn,
										emailInstance: emailInstance!,
									})
									break
								case 'email-verification':
									console.warn('Email verification not implemented')
									break
								case 'forget-password':
									console.warn('Forget password not implemented')
									break
							}
						},
					}),
				]
			: []),
		organization({
			async sendInvitationEmail({
				email,
				inviter: { user, role },
				organization: { name, logo },
			}) {
				// await sendInvitationEmail()
			},
			teams: {
				enabled: true,
				maximumTeams: async ({ organizationId, session }, request) => {
					// Check plan
					return 2
				},
				allowRemovingAllTeams: false,
			},
			membershipLimit: 1000 * 1000,
		}),
	],
	advanced: {
		cookiePrefix: appName,
	},
})

export type Session = typeof auth.$Infer.Session
