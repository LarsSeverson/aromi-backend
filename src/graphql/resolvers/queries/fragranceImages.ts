import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { sql, createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'
import { FragranceImage } from '@src/graphql/types/fragranceTypes'

interface FragranceImagesArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id }: FragranceImagesArgs = ctx.args

  const fields = ctx.stash.fields?.images || ctx.info.selectionSetList
  if (!fields || fields.length === 0) {
    return null
  }

  const query = select({
    from: 'fragrances_images_view',
    columns: fields,
    where: {
      fragranceID: { eq: id }
    }
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

  const fragranceImages = toJsonObject(result)[0]

  ctx.stash.images = fragranceImages

  return fragranceImages
}
