import { ConvexError, v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

import { generateCode, getMember } from '../lib'
import { mutation, query } from '../_generated/server'

export const create = mutation({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const joinCode = generateCode()

		const workspaceId = await ctx.db.insert('workspaces', { name: args.name, userId, joinCode })

		await ctx.db.insert('members', { userId, workspaceId, role: 'owner' })

		await ctx.db.insert('channels', { name: 'general', workspaceId })

		return workspaceId
	},
})

export const get = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return []
		}

		const members = await ctx.db
			.query('members')
			.withIndex('by_user_id', (q) => q.eq('userId', userId))
			.collect()

		const workspaceIds = members.map((member) => member.workspaceId)

		const workspaces = []

		for (const workspaceId of workspaceIds) {
			const workspace = await ctx.db.get(workspaceId)

			if (workspace) {
				workspaces.push(workspace)
			}
		}

		return workspaces
	},
})

export const getById = query({
	args: { id: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return null
		}

		const member = await getMember(ctx, args.id, userId)

		if (!member) {
			return null
		}

		return await ctx.db.get(args.id)
	},
})

export const getInfoById = query({
	args: { id: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return null
		}

		const member = await getMember(ctx, args.id, userId)

		const workspace = await ctx.db.get(args.id)

		return { name: workspace?.name, isMember: !!member }
	},
})

export const update = mutation({
	args: { id: v.id('workspaces'), name: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const member = await getMember(ctx, args.id, userId)

		if (!member || member.role !== 'owner') {
			throw new ConvexError("You don't have permission to update this workspace")
		}

		await ctx.db.patch(args.id, { name: args.name })

		return args.id
	},
})

export const remove = mutation({
	args: { id: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const member = await getMember(ctx, args.id, userId)

		if (!member || member.role !== 'owner') {
			throw new ConvexError("You don't have permission to remove this workspace")
		}

		const [members] = await Promise.all([
			ctx.db
				.query('members')
				.withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
				.collect(),
		])

		for (const member of members) {
			await ctx.db.delete(member._id)
		}

		await ctx.db.delete(args.id)

		return args.id
	},
})

export const join = mutation({
	args: { workspaceId: v.id('workspaces'), joinCode: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const workspace = await ctx.db.get(args.workspaceId)

		if (!workspace) {
			throw new ConvexError('Workspace not found')
		}

		if (workspace.joinCode !== args.joinCode.toLowerCase()) {
			throw new ConvexError('Invalid join code')
		}

		const member = await getMember(ctx, workspace._id, userId)

		if (member) {
			throw new ConvexError('Already a member of this workspace')
		}

		await ctx.db.insert('members', { workspaceId: workspace._id, userId, role: 'member' })

		return workspace._id
	},
})

export const newJoinCode = mutation({
	args: { workspaceId: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const member = await getMember(ctx, args.workspaceId, userId)

		if (!member || member.role !== 'owner') {
			throw new ConvexError("You don't have permission to join this workspace")
		}

		const joinCode = generateCode()

		await ctx.db.patch(args.workspaceId, { joinCode })

		return args.workspaceId
	},
})
