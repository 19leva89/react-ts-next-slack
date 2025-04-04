import { Id } from '../_generated/dataModel'
import { QueryCtx } from '../_generated/server'

export const getMessage = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
	return ctx.db.get(messageId)
}
