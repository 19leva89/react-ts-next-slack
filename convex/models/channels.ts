import { ConvexError, v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

import { Id } from '../_generated/dataModel'
import { mutation, query, QueryCtx } from '../_generated/server'

const getMember = async (ctx: QueryCtx, workspaceId: Id<'workspaces'>, userId: Id<'users'>) => {
	return ctx.db
		.query('members')
		.withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', workspaceId).eq('userId', userId))
		.unique()
}

export const create = mutation({
	args: { name: v.string(), workspaceId: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const member = await getMember(ctx, args.workspaceId, userId)

		if (!member || member.role !== 'owner') {
			throw new ConvexError("You don't have permission to create a channel in this workspace")
		}

		const parsedName = args.name.replace(/\s+/g, '-').toLowerCase()

		const channelId = await ctx.db.insert('channels', { name: parsedName, workspaceId: args.workspaceId })

		return channelId
	},
})

export const get = query({
	args: { workspaceId: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return []
		}

		const member = await getMember(ctx, args.workspaceId, userId)

		if (!member) {
			return []
		}

		const channels = await ctx.db
			.query('channels')
			.withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.workspaceId))
			.collect()

		return channels
	},
})

export const getById = query({
	args: { id: v.id('channels') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return null
		}

		const channel = await ctx.db.get(args.id)

		if (!channel) {
			return null
		}

		const member = await getMember(ctx, channel.workspaceId, userId)

		if (!member) {
			return null
		}

		return channel
	},
})

export const update = mutation({
	args: { id: v.id('channels'), name: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const channel = await ctx.db.get(args.id)

		if (!channel) {
			throw new ConvexError('Channel not found')
		}

		const member = await getMember(ctx, channel.workspaceId, userId)

		if (!member || member.role !== 'owner') {
			throw new ConvexError("You don't have permission to update this channel")
		}

		await ctx.db.patch(args.id, { name: args.name })

		return args.id
	},
})

export const remove = mutation({
	args: { id: v.id('channels') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const channel = await ctx.db.get(args.id)

		if (!channel) {
			throw new ConvexError('Channel not found')
		}

		const member = await getMember(ctx, channel.workspaceId, userId)

		if (!member || member.role !== 'owner') {
			throw new ConvexError("You don't have permission to remove this channel")
		}

		await ctx.db.delete(args.id)

		return args.id
	},
})
