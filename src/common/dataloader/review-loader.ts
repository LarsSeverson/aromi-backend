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

    /* 
      The types defined in the graphql schema are structured differently
      in the db. For example the FragranceReview type has myVote, but the db
      table fragrance_reviews fr has no stored knowledge of myVote (because this 
      property is meant to be the current users vote on a review). To get the
      myVote property you have to JOIN another table fragrance_review_votes rv
      to set myVote:
        CASE WHEN rv.vote = 1 THEN true WHEN rv.vote = -1 THEN false ELSE null END AS "myVote"
      
      Also note the "AS "myVote"". In the base query, you use "dCreated, dModified, author, review,
      and myVote" as if those are the columns stored in the table, but they are not. If you open your
      eyes, you'll see that the fragrance_reviews table uses different naming conventions (for best 
      db practices) than graphql does. For example, dCreated is stored as fr.created_at in fr, so you
      have to alias the returned column: fr.created_at AS "dCreated".
    */
    const baseQuery = /* sql */`
      SELECT
        id,
        rating,
        review,
        votes,
        dCreated,
        dModified,
        dDeleted,
        author,
        myVote
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
