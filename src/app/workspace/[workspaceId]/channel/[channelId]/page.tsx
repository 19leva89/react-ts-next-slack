'use client'

import { LoaderIcon, TriangleAlertIcon } from 'lucide-react'

import { useChannelId } from '@/hooks'
import { MessageList } from '@/components/shared'
import { useGetChannel } from '@/features/channels/api/use-get-channel'
import { useGetMessages } from '@/features/messages/api/use-get-messages'
import { ChatInput, Header } from '@/app/workspace/[workspaceId]/channel/[channelId]/_components'

const ChannelIdPage = () => {
	const channelId = useChannelId()

	const { results, status, loadMore } = useGetMessages({ channelId })
	const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId })

	const canLoadMore = status === 'CanLoadMore'
	const isLoadingMore = status === 'LoadingMore'
	const isLoadingFirstPage = status === 'LoadingFirstPage'

	if (channelLoading || isLoadingFirstPage) {
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
				isLoadingMore={isLoadingMore}
				canLoadMore={canLoadMore}
			/>

			<ChatInput placeholder={`Message # ${channel.name}`} />
		</div>
	)
}

export default ChannelIdPage
