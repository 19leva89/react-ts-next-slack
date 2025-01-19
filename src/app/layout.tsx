import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'

import './globals.css'
import { cn, constructMetadata } from '@/lib'
import { ConvexClientProvider } from '@/components/shared/convex-client-provider'

export const metadata = constructMetadata()

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={cn('min-h-screen font-sans antialiased grainy', inter.className)}>
				<ConvexClientProvider>{children}</ConvexClientProvider>
			</body>
		</html>
	)
}
