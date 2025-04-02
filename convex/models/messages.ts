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
		parentMessageId: v.optional(v.id('messages')),
		// TODO: add conversationId
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

		// TODO: Handle conversationId

		const messageId = await ctx.db.insert('messages', {
			body: args.body,
			image: args.image,
			memberId: member._id,
			workspaceId: args.workspaceId,
			channelId: args.channelId,
			parentMessageId: args.parentMessageId,
			// TODO: add conversationId
			updatedAt: Date.now(),
		})

		return messageId
	},
})
