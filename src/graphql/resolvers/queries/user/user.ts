import { Context } from '@src/graphql/schema/context'
import { User } from '@src/graphql/types/userTypes'
import { GraphQLResolveInfo } from 'graphql'

export interface UserArgs {
  id: number
}

export const user = async (parent: User | undefined, args: UserArgs, ctx: Context, info: GraphQLResolveInfo): Promise<User | null> => {
  if (parent) return parent

  const { id } = args

  const query = `--sql
    SELECT 
      id,
      username,
      email,
      cognito_id AS "cognitoId",
      0 AS followers,
      0 AS following
      FROM users
      WHERE id = $1
  `
  const values = [id]

  const { rows } = await ctx.pool.query<User>(query, values)

  return rows.at(0) || null
}
