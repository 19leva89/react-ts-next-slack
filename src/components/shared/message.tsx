import { format } from 'date-fns'
import dynamic from 'next/dynamic'

import { formatFullTime } from '@/lib'
import { Doc, Id } from '../../../convex/_generated/dataModel'
import { Hint, Thumbnail, Toolbar } from '@/components/shared'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'

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
	threadTimestamp,
}: Props) => {
	const avatarFallback = authorName.charAt(0).toUpperCase()

	if (isCompact) {
		return (
			<div className="relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group">
				<div className="flex items-start gap-2">
					<Hint label={formatFullTime(new Date(createdAt))} side="top">
						<button className="w-10 leading-5.5 text-xs text-center text-muted-foreground cursor-pointer hover:underline opacity-0 group-hover:opacity-100">
							{format(new Date(createdAt), 'HH:mm')}
						</button>
					</Hint>

					<div className="flex flex-col w-full">
						<Renderer value={body} />

						<Thumbnail url={image} />

						{updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group">
			<div className="flex items-start gap-2">
				<button className="flex justify-center w-10">
					<Avatar className="size-8 rounded-md">
						<AvatarImage src={authorImage} alt={authorName} className="rounded-md" />

						<AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
							{avatarFallback}
						</AvatarFallback>
					</Avatar>
				</button>

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
				</div>
			</div>
			{!isEditing && (
				<Toolbar
					isAuthor={isAuthor}
					isPending={false}
					handleEdit={() => setEditingId(id)}
					handleThread={() => {}}
					handleDelete={() => {}}
					handleReaction={() => {}}
					hideThreadButton={hideThreadButton}
				/>
			)}
		</div>
	)
}
