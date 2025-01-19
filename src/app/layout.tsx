import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'

import './globals.css'
import { cn, constructMetadata } from '@/lib'

export const metadata = constructMetadata()

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={cn('min-h-screen font-sans antialiased grainy', inter.className)}>{children}</body>
		</html>
	)
}
