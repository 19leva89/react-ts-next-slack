import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

import { query } from '../_generated/server'
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
