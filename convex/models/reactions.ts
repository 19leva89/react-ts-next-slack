import { ConvexError, v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

import { getMember, getMessage } from '../lib'
import { mutation } from '../_generated/server'

export const toggle = mutation({
	args: {
		messageId: v.id('messages'),
		value: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const message = await getMessage(ctx, args.messageId)

		if (!message) {
			throw new ConvexError('Message not found')
		}

		const member = await getMember(ctx, message.workspaceId, userId)

		if (!member || member.role !== 'owner') {
			throw new ConvexError("You don't have permission to update this message")
		}

		const existingMessageReactionFromUser = await ctx.db
			.query('reactions')
			.filter((q) =>
				q.and(
					q.eq(q.field('messageId'), args.messageId),
					q.eq(q.field('memberId'), member._id),
					q.eq(q.field('value'), args.value),
				),
			)
			.first()

		if (existingMessageReactionFromUser) {
			await ctx.db.delete(existingMessageReactionFromUser._id)

			return existingMessageReactionFromUser._id
		} else {
			const newReactionId = await ctx.db.insert('reactions', {
				value: args.value,
				memberId: member._id,
				messageId: message._id,
				workspaceId: message.workspaceId,
			})

			return newReactionId
		}
	},
})
