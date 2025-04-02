import { Id } from '../_generated/dataModel'
import { QueryCtx } from '../_generated/server'

export const getChannel = async (ctx: QueryCtx, channelId: Id<'channels'>) => {
	return ctx.db.get(channelId)
}
