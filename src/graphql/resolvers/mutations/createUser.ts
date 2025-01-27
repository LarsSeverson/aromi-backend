import { AppSyncIdentityCognito, Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, insert, sql } from '@aws-appsync/utils/rds'
import { User } from '@src/graphql/types/userTypes'

interface CreateUserArgs {
 cognitoId: string
 email: string
}

export const request = (ctx: Context): RDSRequest | null => {
  const { cognitoId, email }: CreateUserArgs = ctx.args

  const query = sql`
    INSERT INTO users_view ("cognitoId", email)
    VALUES (${cognitoId}, ${email})
    ON CONFLICT (email)
    DO UPDATE 
      SET email = EXCLUDED.email
    RETURNING *
  `

  return createPgStatement(query)
}

export const response = (ctx: Context): Record<'user', User> | void => {
  const { error, result } = ctx

  if (error) {
    return util.appendError(
      error.message,
      error.type,
      result
    )
  }

  const user = toJsonObject(result)[0][0]

  if (user.user) {
    const identity = ctx.identity as AppSyncIdentityCognito

    const srcCogId = identity.sub || undefined
    const resCogId = user.user.cognitoId || undefined

    if (srcCogId !== resCogId) {
      return util.appendError(
        'You are not authorized to get this users info',
        '403',
        { user: null }
      )
    }
  }

  return user
}
