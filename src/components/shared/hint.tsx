'use client'

import { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui'

interface Props {
	label: string
	children: ReactNode
	side?: 'top' | 'right' | 'bottom' | 'left'
	align?: 'start' | 'center' | 'end'
}

export const Hint = ({ label, children, side = 'bottom', align = 'center' }: Props) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>

				<TooltipContent side={side} align={align} className="border border-white/5 bg-black text-white">
					<p className="text-sm font-medium">{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
