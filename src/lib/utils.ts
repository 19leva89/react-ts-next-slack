import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string): string {
	// If in a browser, return the relative path
	if (typeof window !== 'undefined') {
		return path
	}

	// Define the base URL
	const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: `http://localhost:${process.env.PORT || 3000}`

	// Remove extra slashes to avoid format errors
	return new URL(path, baseUrl).toString()
}
