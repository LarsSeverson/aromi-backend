import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'
import { User } from '@src/graphql/types/userTypes'
import { graphqlFields } from '@src/graphql/utils/graphqlFields'

interface UserArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const fieldName = ctx.info.fieldName
  const fields = graphqlFields(ctx.info.selectionSetList, fieldName)
  const columns = fields[fieldName]

  const { id }: UserArgs = ctx.args

  if (!fields || columns.length === 0) {
    return runtime.earlyReturn({ id })
  }

  const query = select<number>({
    from: 'users_view',
    columns,
    where: { id: { eq: id } }
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
