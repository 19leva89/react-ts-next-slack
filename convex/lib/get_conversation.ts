import { Id } from '../_generated/dataModel'
import { QueryCtx } from '../_generated/server'

export const getConversation = async (ctx: QueryCtx, conversationId: Id<'conversations'>) => {
	return ctx.db.get(conversationId)
}
