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
			className="flex items-center justify-start p-1 max-w-90 border border-transparent rounded-md cursor-pointer hover:bg-white hover:border-border group/thread-bar transition"
		>
			<div className="flex items-center gap-2 overflow-hidden">
				<Avatar className="size-6 rounded-md shrink-0">
					<AvatarImage src={image} alt={name} className="rounded-md" />

					<AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
						{avatarFallback}
					</AvatarFallback>
				</Avatar>

				<span className="text-xs text-sky-700 font-bold truncate hover:underline">
					{count} {count > 1 ? 'replies' : 'reply'}
				</span>

				<span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
					Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
				</span>

				<span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
					View thread
				</span>
			</div>

			<ChevronRightIcon className="ml-auto size-4 text-muted-foreground opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
		</button>
	)
}
