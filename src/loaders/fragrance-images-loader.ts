import DataLoader from 'dataloader'
import { type FragranceImage, type PaginationInput, type SortByInput } from '@src/generated/gql-types'
import { type NonNullableType } from '@src/common/types'
import { getSortColumns } from '@src/common/sort-map'
import { getPagePart, getSortPart } from '@src/common/pagination'
import { decodeCursor } from '@src/common/cursor'
import { mergeAllSignedSrcs } from '@src/common/images'
import { type ApiDataSources } from '@src/datasources'

const BASE_QUERY = /* sql */`
  SELECT
    id,
    s3_key AS url,
    created_at AS "dCreated",
    updated_at AS "dModified",
    fragrance_id AS "fragranceId"
  FROM fragrance_images
  WHERE fragrance_id = ANY($1) 
`

export interface FragranceImageKey {
  fragranceId: number
  sort: NonNullableType<SortByInput>
  first: NonNullable<PaginationInput['first']>
  after: PaginationInput['after']
}

export const createFragranceImagesLoader = (sources: ApiDataSources): DataLoader<FragranceImageKey, FragranceImage[]> =>
  new DataLoader<FragranceImageKey, FragranceImage[]>(async (keys) => {
    const { db, s3 } = sources

    const fragranceIds = keys.map(key => key.fragranceId)
    const key = keys[0]
    const { sort, first, after } = key
    const { by, direction } = sort
    const { dbColumn } = getSortColumns(by)

    const values: unknown[] = [fragranceIds]
    const queryParts = [BASE_QUERY]

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
    const { rows } = await db.query<FragranceImage & { fragranceId: number }>(query, values)
    await mergeAllSignedSrcs({ s3, on: rows })

    return fragranceIds.map(id => rows.filter(row => row.fragranceId === id))
  })
