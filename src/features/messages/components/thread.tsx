import { useState } from 'react'
import { AlertTriangleIcon, LoaderIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui'
import { Message } from '@/components/shared'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGetMessage } from '@/features/messages/api/use-get-message'
import { useCurrentMember } from '@/features/members/api/use-current-member'

interface Props {
	messageId: Id<'messages'>
	onClose: () => void
}

export const Thread = ({ messageId, onClose }: Props) => {
	const workspaceId = useWorkspaceId()

	const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)

	const { data: currentMember } = useCurrentMember({ workspaceId })
	const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId })

	if (loadingMessage) {
		return (
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between h-1/17 px-4 border-b">
					<p className="text-lg font-bold">Thread</p>

					<Button variant="ghost" size="iconSm" onClick={onClose}>
						<XIcon size={20} className="stroke-[1.5]" />
					</Button>
				</div>

				<div className="flex items-center justify-center h-full">
					<LoaderIcon size={20} className="text-muted-foreground animate-spin" />
				</div>
			</div>
		)
	}

	if (!message) {
		return (
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between h-1/17 px-4 border-b">
					<p className="text-lg font-bold">Thread</p>

					<Button variant="ghost" size="iconSm" onClick={onClose}>
						<XIcon size={20} className="stroke-[1.5]" />
					</Button>
				</div>

				<div className="flex flex-col items-center justify-center gap-y-2 h-full">
					<AlertTriangleIcon size={20} className="text-muted-foreground" />

					<p className="text-sm text-muted-foreground">Message not found</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between h-1/18 px-4 border-b">
				<p className="text-lg font-bold">Thread</p>

				<Button variant="ghost" size="iconSm" onClick={onClose}>
					<XIcon size={20} className="stroke-[1.5]" />
				</Button>
			</div>

			<Message
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
				hideThreadButton={true}
			/>
		</div>
	)
}
