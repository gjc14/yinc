import 'dotenv/config'

import { stdin as input, stdout as output } from 'node:process'
import * as readline from 'node:readline/promises'

import { emailService } from '~/lib/email'

const rl = readline.createInterface({ input, output })

export async function testEmailConfiguration() {
	if (!emailService) {
		throw new Error('Email service not configured')
	}

	// readline prompt
	const email = await rl.question('Enter your test email address: ')
	rl.close()

	try {
		console.log(`\n📧 Sending test email to ${email}...`)
		await emailService.sendTextEmail({
			to: email,
			subject: 'Email Configuration Test',
			text: 'If you receive this email, your configuration is working correctly.',
		})
		console.log('✅ Email configuration test passed')
	} catch (error) {
		console.error('❌ Email configuration test failed:', error)
	}
}

console.log('🧪 Running email service tests...\n')

await testEmailConfiguration()
