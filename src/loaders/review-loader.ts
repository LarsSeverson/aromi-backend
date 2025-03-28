import { type Pool } from 'pg'
import DataLoader from 'dataloader'
import { type FragranceReview, type PaginationInput, type SortByInput } from '@src/generated/gql-types'
import { type NonNullableType } from '@src/common/types'
import { getSortColumns } from '@src/common/sort-map'
import { getPagePart, getSortPart } from '@src/common/pagination'
import { decodeCursor } from '@src/common/cursor'

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
    const values = [...fragranceIds]

    const baseQuery = /* sql */`
      SELECT
        fr.id,
        fr.rating,
        fr.review_text AS review,
        fr.votes,
        fr.dCreated,
        fr.dModified,
        fr.dDeleted,
        fr.author,
        CASE
          WHEN rv.vote = 1 THEN true
          WHEN rv.vote = -1 THEN false
          ELSE null
        END AS "myVote"
      FROM fragrance_reviews as fr
      JOIN fragrance_review_votes as rv ON rv.fragrance_review_id = fr.id 
                                        AND rv.user_id = 1
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
    /*
      Type T in pool.query<T> is telling the pool.query function what type is returned for
      each row returned. When you say FragranceReview & { fragranceId: number } you're
      telling the function the returned type is whatever is contained in the FragranceReview
      type AND a key fragranceId which is a number. However, the base query you made does not
      actually get the fragranceId (fr.fragrance_id AS "fragranceId"), so this would likely error
      or returned undefined in the return statement.
    */
    const { rows } = await pool.query<FragranceReview & { fragranceId: number }>(query, values)
    return fragranceIds.map(id => rows.filter(row => row.fragranceId === id))
  })

/*
    You can test this loader by using it in the reviews resolver function
    similar to how the loader for fragrance images is used in resolvers/fragrance/images.
    You can log how long the function takes with and without the loader and see if there's
    a speed up. The main idea of dataloaders is to do exactly what an individual resolver would
    except batched, so there aren't N + 1 hits to the db for every resolver call.
  */
