import { Context } from '@src/graphql/schema/context'
import { User } from '@src/graphql/types/userTypes'
import { GraphQLResolveInfo } from 'graphql'

export const me = (parent: undefined, args: undefined, ctx: Context, info: GraphQLResolveInfo): User | null => {
  return ctx.user || null
}
