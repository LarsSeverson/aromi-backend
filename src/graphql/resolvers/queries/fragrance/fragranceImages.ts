import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'

interface FragranceImagesArgs {
  id: number
  limit: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id, limit = 3 }: FragranceImagesArgs = { id: ctx.args.id || ctx.source.id, limit: ctx.args.limit }

  if (ctx.source?.images) {
    return runtime.earlyReturn(JSON.parse(ctx.source.images))
  }

  const columns = ctx.info.selectionSetList

  const query = select<any>({
    from: 'fragrance_images_view',
    columns,
    where: { fragranceId: { eq: id } },
    limit
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

  const images = toJsonObject(result)[0]

  return images
}
