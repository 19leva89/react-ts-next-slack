import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

import { query } from '../_generated/server'
import { getMember } from '../lib/get_member'
import { populateUser } from '../lib/populate_user'

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

export const current = query({
	args: { workspaceId: v.id('workspaces') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return null
		}

		const member = await getMember(ctx, args.workspaceId, userId)

		if (!member) {
			return null
		}

		return member
	},
})
