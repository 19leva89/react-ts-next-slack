import { Id } from '../../convex/_generated/dataModel'
import { useParentMessageId } from '@/features/messages/store/use-parent-message-id'

export const usePanel = () => {
	const [parentMessageId, setParentMessageId] = useParentMessageId()

	const onOpenMessage = (messageId: Id<'messages'>) => setParentMessageId(messageId)

	const onClose = () => setParentMessageId(null)

	return { parentMessageId, onOpenMessage, onClose }
}
