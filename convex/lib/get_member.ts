import { Id } from '../_generated/dataModel'
import { QueryCtx } from '../_generated/server'

export const getMember = async (ctx: QueryCtx, workspaceId: Id<'workspaces'>, userId: Id<'users'>) => {
	return ctx.db
		.query('members')
		.withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', workspaceId).eq('userId', userId))
		.unique()
}
