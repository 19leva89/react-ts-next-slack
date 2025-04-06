import { ConvexError, v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

import { mutation, query } from '../_generated/server'
import { getChannel, getChannels, getMember } from '../lib'

export const create = mutation({
	args: { name: v.string(), workspaceId: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const currentMember = await getMember(ctx, args.workspaceId, userId)

		if (!currentMember || currentMember.role !== 'owner') {
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

		const currentMember = await getMember(ctx, args.workspaceId, userId)

		if (!currentMember) {
			return []
		}

		const channels = await getChannels(ctx, args.workspaceId)

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

		const channel = await getChannel(ctx, args.id)

		if (!channel) {
			return null
		}

		const currentMember = await getMember(ctx, channel.workspaceId, userId)

		if (!currentMember) {
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

		const channel = await getChannel(ctx, args.id)

		if (!channel) {
			throw new ConvexError('Channel not found')
		}

		const currentMember = await getMember(ctx, channel.workspaceId, userId)

		if (!currentMember || currentMember.role !== 'owner') {
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

		const channel = await getChannel(ctx, args.id)

		if (!channel) {
			throw new ConvexError('Channel not found')
		}

		const currentMember = await getMember(ctx, channel.workspaceId, userId)

		if (!currentMember || currentMember.role !== 'owner') {
			throw new ConvexError("You don't have permission to remove this channel")
		}

		// TODO: Remove associated messages

		await ctx.db.delete(args.id)

		return args.id
	},
})
