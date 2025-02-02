import { Context, RDSRequest, util, runtime, AppSyncIdentityIAM, AppSyncIdentityCognito } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'
import { User } from '@src/graphql/types/userTypes'
import { graphqlFields } from '@src/graphql/utils/graphqlFields'

interface UserArgs {
  id?: number | undefined

  cognitoId?: string | undefined
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id, cognitoId }: UserArgs = ctx.args

  if (!id && !cognitoId) return runtime.earlyReturn(null)

  const fieldName = ctx.info.fieldName
  const fields = graphqlFields(ctx.info.selectionSetList, fieldName)
  const columns = fields[fieldName]

  if (!fields || columns.length === 0) {
    return runtime.earlyReturn({ id })
  }

  const query = select<number>({
    from: 'users_view',
    columns,
    where: {
      or: [
        id ? { id: { eq: id } } : {},
        cognitoId ? { cognitoId: { eq: cognitoId } } : {}
      ]
    }
  })

  return createPgStatement(query)
}

export const response = (ctx: Context): Record<string, User | null> | void => {
  const { error, result } = ctx

  if (error) {
    return util.appendError(
      error.message,
      error.type,
      result
    )
  }

  const user: Record<'user', User> = toJsonObject(result)[0][0]

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
