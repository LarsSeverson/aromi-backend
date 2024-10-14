import { Context, util } from '@aws-appsync/utils'
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

  const results = ctx.prev.result
  const fragrance = results.fragrance || {}

  if (results.accords) {
    fragrance.accords = results.accords
  }
  if (results.notes) {
    fragrance.notes = results.notes
  }
  if (results.images) {
    fragrance.images = results.images
  }

  return fragrance
}
