import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'

interface FragranceImagesArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id }: FragranceImagesArgs = ctx.args

  const fields = ctx.stash.fields?.images || ctx.info.selectionSetList
  if (!fields || fields.length === 0) {
    return runtime.earlyReturn(ctx.prev?.result)
  }

  const query = select({
    from: 'fragrance_images_view',
    columns: fields,
    where: { fragranceID: { eq: id } }
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
  const results = ctx.prev?.result

  if (results) {
    results.images = images
    return results
  }

  return images
}
