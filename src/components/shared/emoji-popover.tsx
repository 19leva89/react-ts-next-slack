import { ReactNode, useState } from 'react'
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'

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
	onEmojiSelect?: (value: string) => void
}

export const EmojiPopover = ({ children, hint = 'Emoji', onEmojiSelect }: Props) => {
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
	const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)

	const onSelect = (value: EmojiClickData) => {
		onEmojiSelect?.(value.emoji)

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

					<TooltipContent className='border border-white/5 bg-black text-white'>
						<p className='text-xs font-medium'>{hint}</p>
					</TooltipContent>
				</Tooltip>

				<PopoverContent className='w-full border-none p-0 shadow-none'>
					<EmojiPicker onEmojiClick={onSelect} />
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	)
}
