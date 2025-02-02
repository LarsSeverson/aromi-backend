import { Context } from '@src/graphql/schema/context'
import { User } from '@src/graphql/types/userTypes'
import { GraphQLResolveInfo } from 'graphql'

export const me = async (parent: undefined, args: undefined, ctx: Context, info: GraphQLResolveInfo): Promise<User | null> => {
  const userId = ctx.userId

  if (!userId) return null

  const res = await ctx.pool.query(`
    SELECT 
      id,
      email,
      username,
      cognito_id AS "cognitoId"
    FROM users WHERE id = $1;
  `, [userId])

  const user = res.rows[0] || null

  return user
}
