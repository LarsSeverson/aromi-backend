import { type Pool } from 'pg'
import DataLoader from 'dataloader'
import { type FragranceReview, type PaginationInput, type SortByInput } from '@src/generated/gql-types'
import { type NonNullableType } from '../types'
import { getSortColumns } from '../sort-map'
import { getPagePart, getSortPart } from '../pagination'
import { decodeCursor } from '../cursor'

export interface ReviewKey {
  fragranceId: number
  sort: NonNullableType<SortByInput>
  first: NonNullable<PaginationInput['first']>
  after: PaginationInput['after']
}

export const createFragranceReviewLoader = (pool: Pool): DataLoader<ReviewKey, FragranceReview[]> =>
  new DataLoader<ReviewKey, FragranceReview[]>(async (keys) => {
    const fragranceIds = keys.map(key => key.fragranceId)
    const key = keys[0]
    const { sort, first, after } = key
    const { by, direction } = sort

    const { dbColumn } = getSortColumns(by)
    const values: Array<number | string> = [...fragranceIds]

    const baseQuery = /* sql */`
      SELECT
        id,
        rating,
        votes,
        review_text AS review,
        created_at AS "dCreated",
        updated_at AS "dModified",
        deleted_at AS "dDeleted",
        user_id AS "userId"
      FROM fragrance_reviews
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
    const { rows } = await pool.query<FragranceReview & { fragranceId: number }>(query, values)

    return fragranceIds.map(id => rows.filter(row => row.fragranceId === id))
  })
