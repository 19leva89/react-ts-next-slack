import { toast } from 'sonner'
import { format } from 'date-fns'
import dynamic from 'next/dynamic'

import { cn, formatFullTime } from '@/lib'
import { useConfirm, usePanel } from '@/hooks'
import { Doc, Id } from '../../../convex/_generated/dataModel'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { useRemoveMessage } from '@/features/messages/api/use-remove-message'
import { useUpdateMessage } from '@/features/messages/api/use-update-message'
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction'
import { Hint, Reactions, ThreadBar, Thumbnail, Toolbar } from '@/components/shared'

const Editor = dynamic(() => import('@/components/shared/editor'), { ssr: false })
const Renderer = dynamic(() => import('@/components/shared/renderer'), { ssr: false })

interface Props {
	id: Id<'messages'>
	memberId: Id<'members'>
	authorImage?: string
	authorName?: string
	isAuthor: boolean
	reactions: Array<Omit<Doc<'reactions'>, 'memberId'> & { count: number; memberIds: Id<'members'>[] }>
	body: Doc<'messages'>['body']
	image: string | null | undefined
	updatedAt: Doc<'messages'>['updatedAt']
	createdAt: Doc<'messages'>['_creationTime']
	isEditing: boolean
	setEditingId: (id: Id<'messages'> | null) => void
	isCompact?: boolean
	hideThreadButton?: boolean
	threadCount?: number
	threadImage?: string
	threadName?: string
	threadTimestamp?: number
}

export const Message = ({
	id,
	memberId,
	authorImage,
	authorName = 'Member',
	isAuthor,
	reactions,
	body,
	image,
	updatedAt,
	createdAt,
	isEditing,
	setEditingId,
	isCompact,
	hideThreadButton,
	threadCount,
	threadImage,
	threadName,
	threadTimestamp,
}: Props) => {
	const [ConfirmDialog, confirm] = useConfirm(
		'Delete message',
		'Are you sure you want to delete this message? This cannot be undone!',
	)

	const { parentMessageId, onOpenMessage, onClose } = usePanel()
	const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage()
	const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage()
	const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction()

	const isPending = isUpdatingMessage
	const avatarFallback = authorName.charAt(0).toUpperCase()

	const handleReaction = (value: string) => {
		toggleReaction({ messageId: id, value }, { onError: () => toast.error('Failed to toggle reaction') })
	}

	const handleUpdate = ({ body }: { body: string }) =>
		updateMessage(
			{ id, body },
			{
				onSuccess: () => {
					toast.success('Message updated')

					setEditingId(null)
				},
				onError: () => {
					toast.error('Failed to update message')
				},
			},
		)

	const handleRemove = async () => {
		const ok = await confirm()

		if (!ok) return

		removeMessage(
			{ id },
			{
				onSuccess: () => {
					toast.success('Message deleted')

					if (parentMessageId === id) {
						onClose()
					}
				},
				onError: () => {
					toast.error('Failed to delete message')
				},
			},
		)
	}

	if (isCompact) {
		return (
			<>
				<div
					className={cn(
						'relative flex flex-col gap-2 p-2 px-5 hover:bg-gray-100/60 group',
						isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
						isRemovingMessage &&
							'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-300',
					)}
				>
					<div className="flex items-start gap-2">
						<Hint label={formatFullTime(new Date(createdAt))} side="top">
							<button className="w-10 leading-5.5 text-xs text-center text-muted-foreground cursor-pointer hover:underline opacity-0 group-hover:opacity-100">
								{format(new Date(createdAt), 'HH:mm')}
							</button>
						</Hint>

						{isEditing ? (
							<div className="size-full">
								<Editor
									onSubmit={handleUpdate}
									onCancel={() => setEditingId(null)}
									defaultValue={JSON.parse(body)}
									disabled={isPending}
									variant="update"
								/>
							</div>
						) : (
							<div className="flex flex-col w-full">
								<Renderer value={body} />

								<Thumbnail url={image} />

								{updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}

								<Reactions reactions={reactions} onChange={handleReaction} />

								<ThreadBar
									count={threadCount}
									image={threadImage}
									name={threadName}
									timestamp={threadTimestamp}
									onClick={() => onOpenMessage(id)}
								/>
							</div>
						)}
					</div>

					{!isEditing && (
						<Toolbar
							isAuthor={isAuthor}
							isPending={isPending}
							handleEdit={() => setEditingId(id)}
							handleThread={() => onOpenMessage(id)}
							handleDelete={handleRemove}
							handleReaction={handleReaction}
							hideThreadButton={hideThreadButton}
						/>
					)}
				</div>

				<ConfirmDialog />
			</>
		)
	}

	return (
		<>
			<div
				className={cn(
					'relative flex flex-col gap-2 p-2 px-5 hover:bg-gray-100/60 group',
					isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
					isRemovingMessage && 'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-300',
				)}
			>
				<div className="flex items-start gap-2">
					<button className="flex justify-center w-10">
						<Avatar className="size-8 rounded-md">
							<AvatarImage src={authorImage} alt={authorName} className="rounded-md" />

							<AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
								{avatarFallback}
							</AvatarFallback>
						</Avatar>
					</button>

					{isEditing ? (
						<div className="size-full">
							<Editor
								onSubmit={handleUpdate}
								onCancel={() => setEditingId(null)}
								defaultValue={JSON.parse(body)}
								disabled={isPending}
								variant="update"
							/>
						</div>
					) : (
						<div className="flex flex-col w-full overflow-hidden">
							<div className="text-sm">
								<button onClick={() => {}} className="font-bold text-primary cursor-pointer hover:underline">
									{authorName}
								</button>

								<span>&nbsp;&nbsp;</span>

								<Hint label={formatFullTime(new Date(createdAt))} side="top">
									<button className="text-xs text-muted-foreground cursor-pointer hover:underline">
										{format(new Date(createdAt), 'h:mm a')}
									</button>
								</Hint>
							</div>

							<Renderer value={body} />

							<Thumbnail url={image} />

							{updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}

							<Reactions reactions={reactions} onChange={handleReaction} />

							<ThreadBar
								count={threadCount}
								image={threadImage}
								name={threadName}
								timestamp={threadTimestamp}
								onClick={() => onOpenMessage(id)}
							/>
						</div>
					)}
				</div>

				{!isEditing && (
					<Toolbar
						isAuthor={isAuthor}
						isPending={isPending}
						handleEdit={() => setEditingId(id)}
						handleThread={() => onOpenMessage(id)}
						handleDelete={handleRemove}
						handleReaction={handleReaction}
						hideThreadButton={hideThreadButton}
					/>
				)}
			</div>

			<ConfirmDialog />
		</>
	)
}
