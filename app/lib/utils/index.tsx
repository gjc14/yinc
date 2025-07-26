import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export type ConventionalActionResponse<T = unknown> = {
	msg?: string
	err?: string
	data?: T
	options?: {
		preventAlert?: boolean
	}
}

export type ConventionalSuccess<T = unknown> = {
	msg: string
	err?: undefined
	data?: T
	options?: {
		preventAlert?: boolean
	}
}

export type ConventionalError<T = unknown> = {
	msg?: undefined
	err: string
	data?: T
	options?: {
		preventAlert?: boolean
	}
}

export const isConventionalSuccess = (
	fetcherData: unknown,
): fetcherData is ConventionalSuccess => {
	if (typeof fetcherData !== 'object' || fetcherData === null) return false
	if (!('msg' in fetcherData)) return false
	if ('err' in fetcherData && fetcherData.err) return false
	return true
}

export const isConventionalError = (
	fetcherData: unknown,
): fetcherData is ConventionalError => {
	if (typeof fetcherData !== 'object' || fetcherData === null) return false
	if (!('err' in fetcherData) || !fetcherData.err) return false
	return true
}

export const capitalize = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export const isValidEmail = (email: string) => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	return emailRegex.test(email)
}
