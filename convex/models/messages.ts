import { ConvexError, v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

import { Id } from '../_generated/dataModel'
import { mutation, QueryCtx } from '../_generated/server'

const getMember = async (ctx: QueryCtx, workspaceId: Id<'workspaces'>, userId: Id<'users'>) => {
	return ctx.db
		.query('members')
		.withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', workspaceId).eq('userId', userId))
		.unique()
}

export const create = mutation({
	args: {
		body: v.string(),
		image: v.optional(v.id('_storage')),
		workspaceId: v.id('workspaces'),
		channelId: v.optional(v.id('channels')),
		conversationId: v.optional(v.id('conversations')),
		parentMessageId: v.optional(v.id('messages')),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const member = await getMember(ctx, args.workspaceId, userId)

		if (!member || member.role !== 'owner') {
			throw new ConvexError("You don't have permission to create a message")
		}

		let _conversationId = args.conversationId

		// Only possible if we are replying in a thread in 1:1 conversation
		if (!args.conversationId && !args.channelId && args.parentMessageId) {
			const parentMessage = await ctx.db.get(args.parentMessageId)

			if (!parentMessage) {
				throw new ConvexError('Parent message not found')
			}

			_conversationId = parentMessage.conversationId
		}

		const messageId = await ctx.db.insert('messages', {
			body: args.body,
			image: args.image,
			memberId: member._id,
			workspaceId: args.workspaceId,
			channelId: args.channelId,
			conversationId: _conversationId,
			parentMessageId: args.parentMessageId,
			updatedAt: Date.now(),
		})

		return messageId
	},
})
