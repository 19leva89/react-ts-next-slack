'use client'

import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { AlertTriangleIcon, LoaderIcon } from 'lucide-react'

import { useMemberId, useWorkspaceId } from '@/hooks'
import { Id } from '../../../../../../convex/_generated/dataModel'
import { Conversation } from '@/app/workspace/[workspaceId]/member/[memberId]/_components'
import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation'

const MemberIdPage = () => {
	const memberId = useMemberId()
	const workspaceId = useWorkspaceId()

	const [conversationId, setConversationId] = useState<Id<'conversations'> | null>(null)

	const { mutate, isPending } = useCreateOrGetConversation()

	useEffect(() => {
		mutate(
			{ workspaceId, memberId },
			{
				onSuccess: (id) => setConversationId(id),
				onError: () => toast.error('Failed to create or get conversation'),
			},
		)
	}, [workspaceId, memberId, mutate])

	if (isPending)
		return (
			<div className='flex h-full items-center justify-center'>
				<LoaderIcon size={24} className='animate-spin text-muted-foreground' />
			</div>
		)

	if (!conversationId)
		return (
			<div className='flex h-full flex-col items-center justify-center gap-y-2'>
				<AlertTriangleIcon size={24} className='text-muted-foreground' />

				<p className='text-sm text-muted-foreground'>Conversation not found</p>
			</div>
		)

	return <Conversation id={conversationId} />
}

export default MemberIdPage
