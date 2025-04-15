import { type Pool } from 'pg'
import DataLoader from 'dataloader'
import { type FragranceReview, type PaginationInput, type SortByInput } from '@src/generated/gql-types'
import { type NonNullableType } from '@src/common/types'
import { getSortColumns } from '@src/common/sort-map'
import { getPagePart, getSortPart } from '@src/common/pagination'
import { decodeCursor } from '@src/common/cursor'

const BASE_QUERY = /* sql */`
  SELECT
    fr.fragrance_id AS "fragranceId",
    fr.id,
    fr.rating,
    fr.votes,
    fr.review_text AS review,
    fr.created_at AS "dCreated",
    fr.updated_at AS "dModified",
    fr.deleted_at AS "dDeleted",
    CASE
      WHEN rv.vote = 1 THEN true
      WHEN rv.vote = -1 THEN false
      ELSE null
    END AS "myVote"
  FROM fragrance_reviews fr
  LEFT JOIN fragrance_review_votes rv ON rv.fragrance_review_id = fr.id AND rv.user_id = $2
  WHERE fr.fragrance_id = ANY($1)
`

export interface FragranceReviewKey {
  fragranceId: number
  myUserId: number | undefined
  sort: NonNullableType<SortByInput>
  first: NonNullable<PaginationInput['first']>
  after: PaginationInput['after']
}

export const createFragranceReviewsLoader = (pool: Pool): DataLoader<FragranceReviewKey, FragranceReview[]> =>
  new DataLoader<FragranceReviewKey, FragranceReview[]>(async (keys) => {
    const fragranceIds = keys.map(key => key.fragranceId)
    const key = keys[0]
    const { sort, first, after, myUserId } = key
    const { by, direction } = sort
    const { dbColumn } = getSortColumns(by)

    const values: unknown[] = [fragranceIds, myUserId]
    const queryParts = [BASE_QUERY]

    if (after != null) {
      const sortPart = getSortPart(direction, dbColumn, values.length, 'fr')
      queryParts.push(sortPart)
      const { sortValue, id } = decodeCursor(after)
      values.push(sortValue, id)
    }

    const pagePart = getPagePart(direction, dbColumn, values.length, 'fr')
    queryParts.push(pagePart)
    values.push(first + 1)

    const query = queryParts.join('\n')
    const { rows } = await pool.query<FragranceReview & { fragranceId: number }>(query, values)

    return fragranceIds.map(id => rows.filter(row => row.fragranceId === id))
  })
