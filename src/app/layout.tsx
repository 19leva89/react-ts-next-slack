import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'

import { cn, constructMetadata } from '@/lib'
import { Modals } from '@/components/shared/modals'
import { ConvexClientProvider } from '@/components/shared/convex-client-provider'

import './globals.css'

export const metadata = constructMetadata()

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="en">
				<body className={cn('min-h-screen font-sans antialiased grainy', inter.className)}>
					<ConvexClientProvider>
						<Modals />

						{children}
					</ConvexClientProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	)
}
