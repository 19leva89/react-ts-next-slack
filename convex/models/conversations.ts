import { ConvexError, v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

import { mutation } from '../_generated/server'
import { getConversation, getMember } from '../lib'

export const createOrGet = mutation({
	args: { memberId: v.id('members'), workspaceId: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const currentMember = await getMember(ctx, args.workspaceId, userId)

		if (!currentMember) {
			throw new ConvexError("You don't have permission to create a conversation")
		}

		const otherMember = await ctx.db.get(args.memberId)

		if (!currentMember || !otherMember) {
			throw new ConvexError('Member not found')
		}

		const existingConversation = await ctx.db
			.query('conversations')
			.filter((q) => q.eq(q.field('workspaceId'), args.workspaceId))
			.filter((q) =>
				q.or(
					q.and(
						q.eq(q.field('memberOneId'), currentMember._id),
						q.eq(q.field('memberTwoId'), otherMember._id),
					),
					q.and(
						q.eq(q.field('memberOneId'), otherMember._id),
						q.eq(q.field('memberTwoId'), currentMember._id),
					),
				),
			)
			.unique()

		if (existingConversation) {
			return existingConversation._id
		}

		const conversationId = await ctx.db.insert('conversations', {
			workspaceId: args.workspaceId,
			memberOneId: currentMember._id,
			memberTwoId: otherMember._id,
		})

		return conversationId
	},
})
