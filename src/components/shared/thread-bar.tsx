import { formatDistanceToNow } from 'date-fns'
import { ChevronRightIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'

interface Props {
	count?: number
	image?: string
	name?: string
	timestamp?: number
	onClick?: () => void
}

export const ThreadBar = ({ count, image, name = 'Member', timestamp, onClick }: Props) => {
	const avatarFallback = name.charAt(0).toUpperCase()

	if (!count || !timestamp) return null

	return (
		<button
			onClick={onClick}
			className='group/thread-bar flex max-w-90 cursor-pointer items-center justify-start rounded-md border border-transparent p-1 transition hover:border-border hover:bg-white'
		>
			<div className='flex items-center gap-2 overflow-hidden'>
				<Avatar className='size-6 shrink-0 rounded-md'>
					<AvatarImage src={image} alt={name} className='rounded-md' />

					<AvatarFallback className='rounded-md bg-sky-500 text-xs text-white'>
						{avatarFallback}
					</AvatarFallback>
				</Avatar>

				<span className='truncate text-xs font-bold text-sky-700 hover:underline'>
					{count} {count > 1 ? 'replies' : 'reply'}
				</span>

				<span className='block truncate text-xs text-muted-foreground group-hover/thread-bar:hidden'>
					Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
				</span>

				<span className='hidden truncate text-xs text-muted-foreground group-hover/thread-bar:block'>
					View thread
				</span>
			</div>

			<ChevronRightIcon className='ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover/thread-bar:opacity-100' />
		</button>
	)
}
