import { Id } from '../_generated/dataModel'
import { QueryCtx } from '../_generated/server'

export const getChannels = async (ctx: QueryCtx, workspaceId: Id<'workspaces'>) => {
	return ctx.db
		.query('channels')
		.withIndex('by_workspace_id', (q) => q.eq('workspaceId', workspaceId))
		.collect()
}
