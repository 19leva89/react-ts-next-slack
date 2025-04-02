import { usePaginatedQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

const BATCH_SIZE = 20

interface Props {
	channelId?: Id<'channels'>
	conversationId?: Id<'conversations'>
	parentMessageId?: Id<'messages'>
}

export type GetMessagesReturnType = (typeof api.models.messages.get)['_returnType']

export const useGetMessages = ({ channelId, conversationId, parentMessageId }: Props) => {
	const { results, status, loadMore } = usePaginatedQuery(
		api.models.messages.get as any,
		{ channelId, conversationId, parentMessageId },
		{ initialNumItems: BATCH_SIZE },
	)

	return { results, status, loadMore: () => loadMore(BATCH_SIZE) }
}
