import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import qs from 'query-string'
import { RemoveUrlQueryParams, UrlQueryParams } from '@/types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatPrice(
	price: number | string,
	options: {
		currency?: 'ZMW' | 'EUR' | 'GBP' | 'BDT'
		notation?: Intl.NumberFormatOptions['notation']
	} = {},
) {
	const { currency = 'ZMW', notation = 'compact' } = options

	const numericPrice = typeof price === 'string' ? parseFloat(price) : price

	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		notation,
		maximumFractionDigits: 2,
	}).format(numericPrice)
}

export function removeKeysFromQuery({
	params,
	keysToRemove,
}: RemoveUrlQueryParams) {
	const currentUrl = qs.parse(params)

	keysToRemove.forEach((key: any) => {
		delete currentUrl[key]
	})

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true },
	)
}

export const handleError = (error: unknown) => {
	console.error(error)
	throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
	const currentUrl = qs.parse(params)

	currentUrl[key] = value

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true },
	)
}

// Function to capitalize the first letter
export const capitalizeFirstLetter = (string: string): string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

// Function to lowercase the first letter
export const lowercaseFirstLetter = (string: string): string => {
	return string.charAt(0).toLowerCase() + string.slice(1)
}

export const sentenceCase = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const lowerCase = (str: string): string => {
	return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase()
}

export const titleCase = (str: string): string => {
	return str
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}
