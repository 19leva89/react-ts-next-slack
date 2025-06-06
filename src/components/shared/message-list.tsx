import { useState } from 'react'
import { LoaderIcon } from 'lucide-react'
import { differenceInMinutes, format } from 'date-fns'

import { formatDateLabel } from '@/lib'
import { useWorkspaceId } from '@/hooks'
import { Separator } from '@/components/ui'
import { Id } from '../../../convex/_generated/dataModel'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { ChannelHero, ConversationHero, Message } from '@/components/shared'
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
		<div className='messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pb-4'>
			{Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
				<div key={dateKey}>
					<div className='relative my-2 text-center'>
						<Separator className='absolute top-1/2 right-0 left-0' />

						<span className='relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm'>
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
								threadName={message.threadName}
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
				className='h-1'
			/>

			{isLoadingMore && (
				<div className='relative my-2 text-center'>
					<Separator className='absolute top-1/2 right-0 left-0' />

					<span className='relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm'>
						<LoaderIcon size={16} className='animate-spin' />
					</span>
				</div>
			)}

			{variant === 'channel' && channelName && channelCreationTime && (
				<ChannelHero name={channelName} creationTime={channelCreationTime} />
			)}

			{variant === 'conversation' && <ConversationHero name={memberName} image={memberImage} />}
		</div>
	)
}
