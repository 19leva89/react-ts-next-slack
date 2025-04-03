import { MessageSquareTextIcon, PencilIcon, SmileIcon, TrashIcon } from 'lucide-react'

import { Button } from '@/components/ui'
import { EmojiPopover, Hint } from '@/components/shared'

interface Props {
	isAuthor: boolean
	isPending: boolean
	handleEdit: () => void
	handleThread: () => void
	handleDelete: () => void
	handleReaction: (value: string) => void
	hideThreadButton?: boolean
}

export const Toolbar = ({
	isAuthor,
	isPending,
	handleEdit,
	handleThread,
	handleDelete,
	handleReaction,
	hideThreadButton,
}: Props) => {
	return (
		<div className="absolute top-0 right-5">
			<div className="border rounded-md bg-white shadow-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
				<EmojiPopover hint="Add reaction" onEmojiSelect={(emoji) => handleReaction(emoji.native)}>
					<Button variant="ghost" size="iconSm" disabled={isPending}>
						<SmileIcon size={16} />
					</Button>
				</EmojiPopover>

				{!hideThreadButton && (
					<Hint label="Reply in thread" side="top">
						<Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleEdit}>
							<MessageSquareTextIcon size={16} />
						</Button>
					</Hint>
				)}

				{isAuthor && (
					<>
						<Hint label="Edit message" side="top">
							<Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleEdit}>
								<PencilIcon size={16} />
							</Button>
						</Hint>

						<Hint label="Delete message" side="top">
							<Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleEdit}>
								<TrashIcon size={16} />
							</Button>
						</Hint>
					</>
				)}
			</div>
		</div>
	)
}
