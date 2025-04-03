'use client'

import { LoaderIcon, TriangleAlertIcon } from 'lucide-react'

import { Header } from './_components/header'
import { MessageList } from '@/components/shared'
import { ChatInput } from './_components/chat-input'
import { useChannelId } from '@/hooks/use-channel-id'
import { useGetChannel } from '@/features/channels/api/use-get-channel'
import { useGetMessages } from '@/features/messages/api/use-get-messages'

const ChannelIdPage = () => {
	const channelId = useChannelId()

	const { results, status, loadMore } = useGetMessages({ channelId })
	const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId })

	if (channelLoading || status === 'LoadingFirstPage') {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<LoaderIcon size={20} className="text-muted-foreground animate-spin" />
			</div>
		)
	}

	if (!channel) {
		return (
			<div className="flex flex-col flex-1 items-center justify-center gap-y-2 h-full">
				<TriangleAlertIcon size={20} className="text-muted-foreground" />

				<span className="text-sm text-muted-foreground">Channel not found</span>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full">
			<Header title={channel.name} />

			<MessageList
				channelName={channel.name}
				channelCreationTime={channel._creationTime}
				data={results}
				loadMore={loadMore}
				isLoadingMore={status === 'LoadingMore'}
				canLoadMore={status === 'CanLoadMore'}
			/>

			<ChatInput placeholder={`Message # ${channel.name}`} />
		</div>
	)
}

export default ChannelIdPage
