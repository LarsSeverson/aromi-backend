import { type Pool } from 'pg'
import DataLoader from 'dataloader'
import { type FragranceImage, type PaginationInput, type SortByInput } from '@src/generated/gql-types'
import { type NonNullableType } from '@src/common/types'
import { getSortColumns } from '@src/common/sort-map'
import { getPagePart, getSortPart } from '@src/common/pagination'
import { decodeCursor } from '@src/common/cursor'
import { getSignedImages } from '@src/common/images'

export interface FragranceImageKey {
  fragranceId: number
  sort: NonNullableType<SortByInput>
  first: NonNullable<PaginationInput['first']>
  after: PaginationInput['after']
}

export const createFragranceImagesLoader = (pool: Pool): DataLoader<FragranceImageKey, FragranceImage[]> =>
  new DataLoader<FragranceImageKey, FragranceImage[]>(async (keys) => {
    const fragranceIds = keys.map(key => key.fragranceId)
    const key = keys[0]
    const { sort, first, after } = key
    const { by, direction } = sort

    const { dbColumn } = getSortColumns(by)
    const values: Array<number | string> = [...fragranceIds]

    const baseQuery = /* sql */`
      SELECT
        id,
        s3_key AS url,
        created_at AS "dCreated",
        updated_at AS "dModified",
        fragrance_id AS "fragranceId"
      FROM fragrance_images
      WHERE fragrance_id IN (${fragranceIds.map((_, i) => '$' + (i + 1)).join(', ')})
    `
    const queryParts = [baseQuery]

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
    const { rows } = await pool.query<FragranceImage & { fragranceId: number }>(query, values)
    const signedImages = await getSignedImages(rows, 'url')

    return fragranceIds.map(id => signedImages.filter(row => row.fragranceId === id))
  })
