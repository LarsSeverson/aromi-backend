import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, insert } from '@aws-appsync/utils/rds'

interface CreateUserArgs {
 username: string
 cognitoId: string
}

export const request = (ctx: Context): RDSRequest | null => {
  const { username, cognitoId }: CreateUserArgs = ctx.args

  const query = insert({
    table: 'users_view',
    values: { username, cognitoId },
    returning: '*'
  })

  return createPgStatement(query)
}

export const response = (ctx: Context): any => {
  const { error, result } = ctx

  if (error) {
    return util.appendError(
      error.message,
      error.type,
      result
    )
  }

  const user = toJsonObject(result)[0][0]

  return user
}
