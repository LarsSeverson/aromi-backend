import { Context, util } from '@aws-appsync/utils'
import { toJsonObject } from '@aws-appsync/utils/rds'
import { graphqlFields } from '@src/graphql/utils/graphqlFields'

export const request = (ctx: Context): void => {
  const fields = graphqlFields(ctx.info.selectionSetList, ctx.info.fieldName, ['accords', 'notes', 'images'])

  ctx.stash.fields = fields
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
}
