import { Context, util } from '@aws-appsync/utils'
import { graphqlFields } from '@src/graphql/utils/graphqlFields'

interface FragrancePipelineArgs {
  id: number
}

export const request = (ctx: Context): void => {
//
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

  const fragrance = ctx.stash.fragrance
  const accords = ctx.stash.accords || null
  const notes = ctx.stash.notes || null
  const images = ctx.stash.images || null

  fragrance.accords = accords
  fragrance.notes = notes
  fragrance.images = images

  return fragrance
}
