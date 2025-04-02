import { ConvexError, v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { paginationOptsValidator } from 'convex/server'

import { getMember } from '../lib/get_member'
import { Doc, Id } from '../_generated/dataModel'
import { populateUser } from '../lib/populate_user'
import { mutation, query } from '../_generated/server'
import { populateMember } from '../lib/populate_member'
import { populateThread } from '../lib/populate_thread'
import { populateReactions } from '../lib/populate_reactions'

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
		})

		return messageId
	},
})

export const get = query({
	args: {
		channelId: v.optional(v.id('channels')),
		conversationId: v.optional(v.id('conversations')),
		parentMessageId: v.optional(v.id('messages')),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return []
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

		const results = await ctx.db
			.query('messages')
			.withIndex('by_channel_id_parent_message_id_conversation_id', (q) =>
				q
					.eq('channelId', args.channelId)
					.eq('parentMessageId', args.parentMessageId)
					.eq('conversationId', _conversationId),
			)
			.order('desc')
			.paginate(args.paginationOpts)

		return {
			...results,
			page: (
				await Promise.all(
					results.page.map(async (message) => {
						const member = await populateMember(ctx, message.memberId)
						const user = member ? await populateUser(ctx, member.userId) : null

						if (!member || !user) {
							return null
						}

						const reactions = await populateReactions(ctx, message._id)
						const thread = await populateThread(ctx, message._id)
						const image = message.image ? await ctx.storage.getUrl(message.image) : undefined

						const reactionsWithCounts = reactions.map((reaction) => {
							return {
								...reaction,
								count: reactions.filter((r) => r.value === reaction.value).length,
							}
						})

						const dedupedReactions = reactionsWithCounts.reduce(
							(acc, reaction) => {
								const existingReaction = acc.find((r) => r.value === reaction.value)

								if (existingReaction) {
									existingReaction.memberIds = Array.from(
										new Set([...existingReaction.memberIds, reaction.memberId]),
									)
								} else {
									acc.push({ ...reaction, memberIds: [reaction.memberId] })
								}

								return acc
							},
							[] as (Doc<'reactions'> & { count: number; memberIds: Id<'members'>[] })[],
						)

						const reactionsWithoutMemberIdProperty = dedupedReactions.map(({ memberId, ...rest }) => {
							return rest
						})

						return {
							...message,
							image,
							member,
							user,
							reactions: reactionsWithoutMemberIdProperty,
							threadCount: thread.count,
							threadImage: thread.image,
							threadTimestamp: thread.timestamp,
						}
					}),
				)
			).filter((message): message is NonNullable<typeof message> => message !== null),
		}
	},
})
