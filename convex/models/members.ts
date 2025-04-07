import { ConvexError, v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

import { mutation, query } from '../_generated/server'
import { getMember, populateMember, populateUser } from '../lib'

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

		const data = await ctx.db
			.query('members')
			.withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.workspaceId))
			.collect()

		const members = []

		for (const member of data) {
			const user = await populateUser(ctx, member.userId)

			if (user) {
				members.push({ ...member, user })
			}
		}

		return members
	},
})

export const getById = query({
	args: { id: v.id('members') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return null
		}

		const member = await populateMember(ctx, args.id)

		if (!member) {
			return null
		}

		const currentMember = await getMember(ctx, member.workspaceId, userId)

		if (!currentMember) {
			return null
		}

		const user = await populateUser(ctx, member.userId)

		if (!user) {
			return null
		}

		return {
			...member,
			user,
		}
	},
})

export const current = query({
	args: { workspaceId: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return null
		}

		const currentMember = await getMember(ctx, args.workspaceId, userId)

		if (!currentMember) {
			return null
		}

		return currentMember
	},
})

export const update = mutation({
	args: {
		id: v.id('members'),
		role: v.union(v.literal('owner'), v.literal('member')),
	},

	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const member = await populateMember(ctx, args.id)

		if (!member) {
			throw new ConvexError("You don't have permission to update this member")
		}

		const currentMember = await getMember(ctx, member.workspaceId, userId)

		if (!currentMember || currentMember.role !== 'owner') {
			throw new ConvexError("You don't have permission to update this member")
		}

		await ctx.db.patch(args.id, { role: args.role })

		return args.id
	},
})

export const remove = mutation({
	args: { id: v.id('members') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			throw new ConvexError('Unauthorized')
		}

		const member = await populateMember(ctx, args.id)

		if (!member) {
			throw new ConvexError("You don't have permission to remove this member")
		}

		const currentMember = await getMember(ctx, member.workspaceId, userId)

		if (!currentMember) {
			throw new ConvexError("You don't have permission to remove this member")
		}

		if (member.role === 'owner') {
			throw new ConvexError("You can't remove the admin")
		}

		if (currentMember._id === args.id && currentMember.role === 'owner') {
			throw new ConvexError("You can't remove yourself")
		}

		const [messages, reactions, conversations] = await Promise.all([
			ctx.db
				.query('messages')
				.withIndex('by_member_id', (q) => q.eq('memberId', member._id))
				.collect(),
			ctx.db
				.query('reactions')
				.withIndex('by_member_id', (q) => q.eq('memberId', member._id))
				.collect(),
			ctx.db
				.query('conversations')
				.filter((q) =>
					q.or(q.eq(q.field('memberOneId'), member._id), q.eq(q.field('memberTwoId'), member._id)),
				)
				.collect(),
		])

		for (const message of messages) {
			await ctx.db.delete(message._id)
		}

		for (const reaction of reactions) {
			await ctx.db.delete(reaction._id)
		}

		for (const conversation of conversations) {
			await ctx.db.delete(conversation._id)
		}

		await ctx.db.delete(args.id)

		return args.id
	},
})
