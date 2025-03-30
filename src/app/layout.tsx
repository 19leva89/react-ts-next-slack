import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'

import { Toaster } from '@/components/ui'
import { cn, constructMetadata } from '@/lib'
import { Modals } from '@/components/shared/modals'
import { ConvexClientProvider, JotaiProvider } from '@/components/shared/providers'

import './globals.css'

export const metadata = constructMetadata()

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="en">
				<body className={cn('min-h-screen font-sans antialiased grainy', inter.className)}>
					<ConvexClientProvider>
						<JotaiProvider>
							<Toaster position="bottom-right" expand={false} richColors />

							<Modals />

							{children}
						</JotaiProvider>
					</ConvexClientProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	)
}
