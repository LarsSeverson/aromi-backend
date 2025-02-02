import { Context, util } from '@aws-appsync/utils'
interface SuggestedFragrancesArgs {
  count?: number
}

export const request = (ctx: Context): void => {
  const { count = 20 }: SuggestedFragrancesArgs = ctx.args
  const limit = 1000

  ctx.stash.count = count
  ctx.stash.limit = limit
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

  const suggestedFragrances = ctx.stash.suggestedFragrances

  return suggestedFragrances
}
