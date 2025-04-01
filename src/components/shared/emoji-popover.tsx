import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { ReactNode, useState } from 'react'

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui'

interface Props {
	children: ReactNode
	hint?: string
	onEmojiSelect?: (emoji: any) => void
}

export const EmojiPopover = ({ children, hint = 'Emoji', onEmojiSelect }: Props) => {
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
	const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)

	const onSelect = (emoji: any) => {
		onEmojiSelect?.(emoji)

		setPopoverOpen(false)

		setTimeout(() => {
			setTooltipOpen(false)
		}, 500)
	}

	return (
		<TooltipProvider>
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
					<PopoverTrigger asChild>
						<TooltipTrigger asChild>{children}</TooltipTrigger>
					</PopoverTrigger>

					<TooltipContent className="bg-black text-white border border-white/5">
						<p className="text-xs font-medium">{hint}</p>
					</TooltipContent>
				</Tooltip>

				<PopoverContent className="w-full p-0 border-none shadow-none">
					<Picker data={data} onEmojiSelect={onSelect} />
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	)
}
