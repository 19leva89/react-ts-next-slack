'use client'

import { LoaderIcon, TriangleAlertIcon } from 'lucide-react'

import { Header } from './_components/header'
import { ChatInput } from './_components/chat-input'
import { useChannelId } from '@/hooks/use-channel-id'
import { useGetChannel } from '@/features/channels/api/use-get-channel'

const ChannelIdPage = () => {
	const channelId = useChannelId()

	const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId })

	if (channelLoading) {
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

			<div className="flex-1" />

			<ChatInput placeholder={`Message # ${channel.name}`} />
		</div>
	)
}

export default ChannelIdPage
