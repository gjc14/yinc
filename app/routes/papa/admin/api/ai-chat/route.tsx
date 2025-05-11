import { type ActionFunctionArgs } from 'react-router'

import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import type { CoreMessage, CoreTool, StreamTextResult } from 'ai'
import { streamText } from 'ai'

import { validateAdminSession } from '~/routes/papa/auth/utils'

export const googleModels = [
	'gemini-1.5-flash-latest',
	'gemini-1.5-pro-latest',
] as const
export const openaiModels = [
	'o1-mini',
	'gpt-4o-mini',
	'gpt-4-turbo',
	'gpt-3.5-turbo',
] as const
export const anthropicModels = ['claude-3-5-sonnet-latest'] as const

export const providers = [
	...googleModels,
	...openaiModels,
	...anthropicModels,
] as const

export type Providers = typeof providers
export type Provider = Providers[number]

export interface ChatAPICustomBody {
	provider: Provider
}

export async function action({ request }: ActionFunctionArgs) {
	if (request.method !== 'POST') {
		throw new Response('', { status: 405, statusText: 'Method not allowed' })
	}

	await validateAdminSession(request)

	try {
		const {
			prompt,
			messages,
			provider,
		}: { prompt?: string; messages?: CoreMessage[] } & ChatAPICustomBody =
			await request.json()

		let result:
			| StreamTextResult<Record<string, CoreTool<any, any>>>
			| undefined = undefined

		if (googleModels.includes(provider as (typeof googleModels)[number])) {
			result = await streamText({
				model: google(provider),
				system: 'You are a helpful assistant.',
				messages,
				prompt,
			})
		} else if (
			openaiModels.includes(provider as (typeof openaiModels)[number])
		) {
			result = await streamText({
				model: openai(provider),
				system: 'You are a helpful assistant.',
				messages,
				prompt,
			})
		} else if (
			anthropicModels.includes(provider as (typeof anthropicModels)[number])
		) {
			result = await streamText({
				model: anthropic('claude-3-5-sonnet-latest'),
				system: 'You are a helpful assistant.',
				messages,
				prompt,
			})
		}

		if (!result) {
			throw new Error('Provider not found')
		}

		const stream = result.toDataStream()

		// Return as a Response with the correct headers
		return new Response(stream, {
			status: 200,
			headers: new Headers({
				'Content-Type': 'text/plain; charset=utf-8',
				'X-Vercel-AI-Data-Stream': 'v1',
			}),
		})
	} catch (error) {
		console.error('Streaming error:', error)
		return new Response('', { status: 500, statusText: 'Streaming failed' })
	}
}
