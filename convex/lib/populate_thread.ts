import { Id } from '../_generated/dataModel'
import { populateUser } from './populate_user'
import { QueryCtx } from '../_generated/server'
import { populateMember } from './populate_member'

export const populateThread = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
	const messages = await ctx.db
		.query('messages')
		.withIndex('by_parent_message_id', (q) => q.eq('parentMessageId', messageId))
		.collect()

	if (messages.length === 0) {
		return {
			count: 0,
			image: undefined,
			timestamp: 0,
			name: '',
		}
	}

	const lastMessage = messages[messages.length - 1]
	const lastMessageMember = await populateMember(ctx, lastMessage.memberId)

	if (!lastMessageMember) {
		return {
			count: 0,
			image: undefined,
			timestamp: 0,
			name: '',
		}
	}

	const lastMessageUser = await populateUser(ctx, lastMessageMember.userId)

	return {
		count: messages.length,
		image: lastMessageUser?.image,
		timestamp: lastMessage._creationTime,
		name: lastMessageUser?.name,
	}
}
