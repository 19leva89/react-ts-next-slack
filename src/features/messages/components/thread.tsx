import Quill from 'quill'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import { ConvexError } from 'convex/values'
import { differenceInMinutes, format } from 'date-fns'
import { AlertTriangleIcon, LoaderIcon, XIcon } from 'lucide-react'

import { formatDateLabel } from '@/lib'
import { Message } from '@/components/shared'
import { Button, Separator } from '@/components/ui'
import { useChannelId, useWorkspaceId } from '@/hooks'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGetMessage } from '@/features/messages/api/use-get-message'
import { useGetMessages } from '@/features/messages/api/use-get-messages'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'

const Editor = dynamic(() => import('@/components/shared/editor'), { ssr: false })

const TIME_THRESHOLD = 5

type EditorValue = {
	body: string
	image: File | null
}

type CreateMessageValues = {
	body: string
	image: Id<'_storage'> | undefined
	channelId: Id<'channels'>
	workspaceId: Id<'workspaces'>
	parentMessageId: Id<'messages'>
}

interface Props {
	messageId: Id<'messages'>
	onClose: () => void
}

export const Thread = ({ messageId, onClose }: Props) => {
	const channelId = useChannelId()
	const workspaceId = useWorkspaceId()
	const editorRef = useRef<Quill | null>(null)

	const [editorKey, setEditorKey] = useState<number>(0)
	const [isPending, setIsPending] = useState<boolean>(false)
	const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)

	const { mutate: createMessage } = useCreateMessage()
	const { mutate: generateUploadUrl } = useGenerateUploadUrl()
	const { data: currentMember } = useCurrentMember({ workspaceId })
	const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId })
	const { results, status, loadMore } = useGetMessages({ channelId, parentMessageId: messageId })

	const canLoadMore = status === 'CanLoadMore'
	const isLoadingMore = status === 'LoadingMore'
	const isLoadingFirstPage = status === 'LoadingFirstPage'

	const groupedMessages = results.reduce(
		(groups, message) => {
			const date = new Date(message._creationTime)
			const dateKey = format(date, 'yyyy-MM-dd')

			if (!groups[dateKey]) {
				groups[dateKey] = []
			}

			groups[dateKey].unshift(message)

			return groups
		},
		{} as Record<string, typeof results>,
	)

	const handleSubmit = async ({ body, image }: EditorValue) => {
		try {
			setIsPending(true)
			editorRef.current?.disable()

			const values: CreateMessageValues = {
				body,
				image: undefined,
				channelId,
				workspaceId,
				parentMessageId: messageId,
			}

			if (image) {
				const url = await generateUploadUrl({ throwOnError: true })

				if (!url) {
					throw new ConvexError('Failed to generate upload url')
				}

				const result = await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': image.type },
					body: image,
				})

				if (!result.ok) {
					throw new ConvexError('Failed to upload image')
				}

				const { storageId } = await result.json()

				values.image = storageId
			}

			await createMessage(values, { throwOnError: true })

			setEditorKey((prevKey) => prevKey + 1)
		} catch {
			toast.error('Failed to create message')
		} finally {
			setIsPending(false)
			editorRef.current?.enable()
		}
	}

	if (loadingMessage || isLoadingFirstPage) {
		return (
			<div className='flex h-full flex-col'>
				<div className='flex h-1/17 items-center justify-between px-4'>
					<p className='text-lg font-bold'>Thread</p>

					<Button variant='ghost' size='iconSm' onClick={onClose}>
						<XIcon size={20} className='stroke-[1.5]' />
					</Button>
				</div>

				<Separator />

				<div className='flex h-full items-center justify-center'>
					<LoaderIcon size={20} className='animate-spin text-muted-foreground' />
				</div>
			</div>
		)
	}

	if (!message) {
		return (
			<div className='flex h-full flex-col'>
				<div className='flex h-1/17 items-center justify-between px-4'>
					<p className='text-lg font-bold'>Thread</p>

					<Button variant='ghost' size='iconSm' onClick={onClose}>
						<XIcon size={20} className='stroke-[1.5]' />
					</Button>
				</div>

				<Separator />

				<div className='flex h-full flex-col items-center justify-center gap-y-2'>
					<AlertTriangleIcon size={20} className='text-muted-foreground' />

					<p className='text-sm text-muted-foreground'>Message not found</p>
				</div>
			</div>
		)
	}

	return (
		<div className='flex h-full flex-col'>
			<div className='flex h-1/18 items-center justify-between px-4'>
				<p className='text-lg font-bold'>Thread</p>

				<Button variant='ghost' size='iconSm' onClick={onClose}>
					<XIcon size={20} className='stroke-[1.5]' />
				</Button>
			</div>

			<Separator />

			<div className='messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pb-4'>
				{Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
					<div key={dateKey}>
						<div className='relative my-2 text-center'>
							<Separator className='absolute top-1/2 right-0 left-0' />

							<span className='relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm'>
								{formatDateLabel(dateKey)}
							</span>
						</div>

						{messages.map((message, index) => {
							const prevMessage = messages[index - 1]
							const isCompact =
								prevMessage &&
								prevMessage.user?._id === message.user._id &&
								differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) <
									TIME_THRESHOLD

							return (
								<Message
									key={message._id}
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
									isCompact={isCompact}
									hideThreadButton={true}
									threadCount={message.threadCount}
									threadImage={message.threadImage}
									threadName={message.threadName}
									threadTimestamp={message.threadTimestamp}
								/>
							)
						})}
					</div>
				))}

				{/* Loading messages when you scroll up */}
				<div
					ref={(el) => {
						if (el) {
							const observer = new IntersectionObserver(
								([entry]) => {
									if (entry.isIntersecting && canLoadMore) {
										loadMore()
									}
								},
								{
									threshold: 1,
								},
							)

							observer.observe(el)
							return () => observer.disconnect()
						}
					}}
					className='h-1'
				/>

				{isLoadingMore && (
					<div className='relative my-2 text-center'>
						<Separator className='absolute top-1/2 right-0 left-0' />

						<span className='relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm'>
							<LoaderIcon size={16} className='animate-spin' />
						</span>
					</div>
				)}

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

			<div className='px-4'>
				<Editor
					key={editorKey}
					onSubmit={handleSubmit}
					placeholder='Reply...'
					disabled={isPending}
					innerRef={editorRef}
				/>
			</div>
		</div>
	)
}
