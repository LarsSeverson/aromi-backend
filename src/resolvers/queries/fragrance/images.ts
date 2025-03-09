import { type FragranceImageEdge, type FragranceImage, type FragranceResolvers } from '@src/generated/gql-types'
import { getSignedImages } from '@src/common/images'
import { getPage, getPagePart, getPaginationInput, getSortPart } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { decodeCursor, encodeCursor } from '@src/common/cursor'

const IMAGES_QUERY = /* sql */`
  SELECT
    id,
    s3_key AS url,
    created_at AS "dCreated",
    updated_at AS "dModified"
  FROM fragrance_images
  WHERE fragrance_id = $1
`

export const images: FragranceResolvers['images'] = async (parent, args, context, info) => {
  const { id } = parent
  const { pool } = context
  const { input } = args
  const { first, after, sortInput } = getPaginationInput(input?.pagination)
  const { by, direction } = sortInput

  const { gqlColumn, dbColumn } = getSortColumns(by)

  const values: Array<string | number> = [id]
  const queryParts = [IMAGES_QUERY]

  if (after != null) {
    const sortPart = getSortPart(direction, dbColumn, values.length)
    queryParts.push(sortPart)
    const { sortValue, id } = decodeCursor(after)
    values.push(sortValue, id)
  }

  const pagePart = getPagePart(direction, dbColumn, values.length)
  queryParts.push(pagePart)
  values.push(first + 1)

  const query = queryParts.join('\n')
  const { rows } = await pool.query<FragranceImage>(query, values)

  const signedImgs = await getSignedImages(rows, 'url')
  const edges = signedImgs.map<FragranceImageEdge>(row => ({
    node: row,
    cursor: encodeCursor(row[gqlColumn], row.id)
  }))

  return getPage(edges, first, after)
}
