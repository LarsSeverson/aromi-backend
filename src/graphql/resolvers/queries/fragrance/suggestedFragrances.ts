import { Context, util } from '@aws-appsync/utils'

export const request = (ctx: Context): any => {
  const { error, result } = ctx

  if (error) {
    return util.appendError(
      error.message,
      error.type,
      result
    )
  }

  return {
    operation: 'Invoke',
    payload: { fragrances: ctx.stash.fragrances }
  }
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

  const suggestedFragrances = result.suggestedFragrances

  ctx.stash.suggestedFragrances = suggestedFragrances

  return suggestedFragrances
}
