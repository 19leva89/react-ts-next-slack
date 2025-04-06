import { LoaderIcon } from 'lucide-react'

import { useMemberId } from '@/hooks'
import { MessageList } from '@/components/shared'
import { useGetMember } from '@/features/members/api/use-get-member'
import { Id } from '../../../../../../../convex/_generated/dataModel'
import { useGetMessages } from '@/features/messages/api/use-get-messages'
import { ChatInput, Header } from '@/app/workspace/[workspaceId]/member/[memberId]/_components'

interface Props {
	id: Id<'conversations'>
}

export const Conversation = ({ id }: Props) => {
	const memberId = useMemberId()

	const { results, status, loadMore } = useGetMessages({ conversationId: id })
	const { data: member, isLoading: loadingMember } = useGetMember({ id: memberId })

	const canLoadMore = status === 'CanLoadMore'
	const isLoadingMore = status === 'LoadingMore'
	const isLoadingFirstPage = status === 'LoadingFirstPage'

	if (loadingMember || isLoadingFirstPage)
		return (
			<div className="flex items-center justify-center h-full">
				<LoaderIcon size={24} className="animate-spin text-muted-foreground" />
			</div>
		)

	return (
		<div className="flex flex-col h-full">
			<Header memberName={member?.user.name} memberImage={member?.user.image} onClick={() => {}} />

			<MessageList
				memberName={member?.user.name}
				memberImage={member?.user.image}
				variant="conversation"
				data={results}
				loadMore={loadMore}
				isLoadingMore={isLoadingMore}
				canLoadMore={canLoadMore}
			/>

			<ChatInput conversationId={id} placeholder={`Message ${member?.user.name}`} />
		</div>
	)
}
