import { NavLink } from 'react-router'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { BreadcrumbItem, BreadcrumbSeparator } from '~/components/ui/breadcrumb'

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

export const generateBreadcrumbs = (pathname: string) => {
	const paths = pathname.split('/').filter(Boolean)
	const breadcrumbItems = paths.reduce((acc: JSX.Element[], path, index) => {
		const link = `/${paths.slice(0, index + 1).join('/')}`
		acc.push(
			<BreadcrumbItem key={index} className="hidden md:block">
				<NavLink
					to={link}
					className={({ isActive }) =>
						`${isActive ? 'text-primary' : 'hover:text-primary'} text-sm`
					}
					end
				>
					{capitalize(path)}
				</NavLink>
			</BreadcrumbItem>,
		)
		if (index < paths.length - 1) {
			acc.push(
				<BreadcrumbSeparator
					key={`separator-${index}`}
					className="hidden md:block size-3"
				/>,
			)
		}
		return acc
	}, [])

	return breadcrumbItems
}

export const isValidEmail = (email: string) => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	return emailRegex.test(email)
}
