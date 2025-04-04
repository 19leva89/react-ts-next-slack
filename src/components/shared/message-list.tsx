import { useState } from 'react'
import { LoaderIcon } from 'lucide-react'
import { differenceInMinutes, format } from 'date-fns'

import { formatDateLabel } from '@/lib'
import { Id } from '../../../convex/_generated/dataModel'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { ChannelHero, Message } from '@/components/shared'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { GetMessagesReturnType } from '@/features/messages/api/use-get-messages'

const TIME_THRESHOLD = 5

interface Props {
	memberName?: string
	memberImage?: string
	channelName?: string
	channelCreationTime?: number
	variant?: 'channel' | 'thread' | 'conversation'
	data: GetMessagesReturnType | undefined
	loadMore: () => void
	isLoadingMore: boolean
	canLoadMore: boolean
}

export const MessageList = ({
	memberName,
	memberImage,
	channelName,
	channelCreationTime,
	variant = 'channel',
	data,
	loadMore,
	isLoadingMore,
	canLoadMore,
}: Props) => {
	const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)

	const workspaceId = useWorkspaceId()

	const { data: currentMember } = useCurrentMember({ workspaceId })

	const groupedMessages = data?.reduce(
		(groups, message) => {
			const date = new Date(message._creationTime)
			const dateKey = format(date, 'yyyy-MM-dd')

			if (!groups[dateKey]) {
				groups[dateKey] = []
			}

			groups[dateKey].unshift(message)

			return groups
		},
		{} as Record<string, typeof data>,
	)

	return (
		<div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
			{Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
				<div key={dateKey}>
					<div className="relative my-2 text-center">
						<hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />

						<span className="relative inline-block px-4 py-1 border border-gray-300 rounded-full bg-white text-xs shadow-sm">
							{formatDateLabel(dateKey)}
						</span>
					</div>

					{messages.map((message, index) => {
						const prevMessage = messages[index - 1]
						const isCompact =
							prevMessage &&
							prevMessage.user?._id === message.user._id &&
							differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) <
								TIME_THRESHOLD

						return (
							<Message
								key={message._id}
								id={message._id}
								memberId={message.memberId}
								authorImage={message.user.image}
								authorName={message.user.name}
								isAuthor={message.memberId === currentMember?._id}
								reactions={message.reactions}
								body={message.body}
								image={message.image}
								updatedAt={message.updatedAt}
								createdAt={message._creationTime}
								isEditing={editingId === message._id}
								setEditingId={setEditingId}
								isCompact={isCompact}
								hideThreadButton={variant === 'thread'}
								threadCount={message.threadCount}
								threadImage={message.threadImage}
								threadTimestamp={message.threadTimestamp}
							/>
						)
					})}
				</div>
			))}

			{/* Loading messages when you scroll up */}
			<div
				ref={(el) => {
					if (el) {
						const observer = new IntersectionObserver(
							([entry]) => {
								if (entry.isIntersecting && canLoadMore) {
									loadMore()
								}
							},
							{
								threshold: 1,
							},
						)

						observer.observe(el)
						return () => observer.disconnect()
					}
				}}
				className="h-1"
			/>

			{isLoadingMore && (
				<div className="relative my-2 text-center">
					<hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />

					<span className="relative inline-block px-4 py-1 border border-gray-300 rounded-full bg-white text-xs shadow-sm">
						<LoaderIcon size={16} className="animate-spin" />
					</span>
				</div>
			)}

			{variant === 'channel' && channelName && channelCreationTime && (
				<ChannelHero name={channelName} creationTime={channelCreationTime} />
			)}
		</div>
	)
}
