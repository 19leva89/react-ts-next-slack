import { MdOutlineAddReaction } from 'react-icons/md'

import { cn } from '@/lib'
import { useWorkspaceId } from '@/hooks'
import { EmojiPopover, Hint } from '@/components/shared'
import { Doc, Id } from '../../../convex/_generated/dataModel'
import { useCurrentMember } from '@/features/members/api/use-current-member'

interface Props {
	reactions: Array<Omit<Doc<'reactions'>, 'memberId'> & { count: number; memberIds: Id<'members'>[] }>
	onChange: (value: string) => void
}

export const Reactions = ({ reactions, onChange }: Props) => {
	const workspaceId = useWorkspaceId()

	const { data: member } = useCurrentMember({ workspaceId })

	const memberId = member?._id

	if (reactions.length === 0 || !memberId) {
		return null
	}

	return (
		<div className='mt-1 mb-1 flex items-center gap-1'>
			{reactions.map((reaction) => (
				<Hint
					key={reaction._id}
					label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'peoples'} reacted with ${reaction.value}`}
					side='top'
				>
					<button
						onClick={() => onChange(reaction.value)}
						className={cn(
							'flex h-6 cursor-pointer items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-2 text-slate-800',
							reaction.memberIds.includes(memberId) && 'border-blue-500 bg-blue-100/70',
						)}
					>
						{reaction.value}

						<span
							className={cn(
								'text-xs font-semibold text-muted-foreground',
								reaction.memberIds.includes(memberId) && 'text-blue-500',
							)}
						>
							{reaction.count}
						</span>
					</button>
				</Hint>
			))}

			<EmojiPopover hint='Add reaction' onEmojiSelect={(emoji) => onChange(emoji)}>
				<button className='flex h-6 cursor-pointer items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-2 text-slate-800 hover:border-slate-500'>
					<MdOutlineAddReaction size={16} />
				</button>
			</EmojiPopover>
		</div>
	)
}
