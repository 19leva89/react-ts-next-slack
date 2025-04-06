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

	const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })

	const memberId = member?._id

	if (reactions.length === 0 || !memberId) {
		return null
	}

	return (
		<div className="flex items-center gap-1 mt-1 mb-1">
			{reactions.map((reaction) => (
				<Hint
					key={reaction._id}
					label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'peoples'} reacted with ${reaction.value}`}
					side="top"
				>
					<button
						onClick={() => onChange(reaction.value)}
						className={cn(
							'flex items-center gap-x-1 h-6 px-2 border border-transparent rounded-full bg-slate-200/70 text-slate-800 cursor-pointer',
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

			<EmojiPopover hint="Add reaction" onEmojiSelect={(emoji) => onChange(emoji.native)}>
				<button className="flex items-center gap-x-1 h-6 px-2 border border-transparent rounded-full bg-slate-200/70 text-slate-800 cursor-pointer hover:border-slate-500">
					<MdOutlineAddReaction size={16} />
				</button>
			</EmojiPopover>
		</div>
	)
}
