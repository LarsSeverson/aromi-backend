import { encodeCursor } from '@src/common/cursor'
import { newPage } from '@src/common/pagination'
import { type FragranceEdge, type Fragrance, type QueryResolvers } from '@src/generated/gql-types'
import { type FragranceRow } from '@src/services/fragranceService'

export class FragranceResolvers {
  fragrance: QueryResolvers['fragrance'] = async (parent, args, context, info) => {
    const { id } = args
    const { services, me } = context

    return await services
      .fragrance
      .withMe(me)
      .getById(id)
      .match(
        row => this.rowToSummary(row),
        error => { throw error }
      )
  }

  fragrances: QueryResolvers['fragrances'] = async (parent, args, context, info) => {
    const { input } = args
    const { services, me } = context

    return await services
      .fragrance
      .withMe(me)
      .list(input)
      .match(
        rows => rows
          .map(row => {
            const summary = this.rowToSummary(row)
          }),
        error => { throw error }
      )
  }

  private rowToSummary (row: FragranceRow): FragranceSummary {
    const {
      id,
      brand, name, rating,
      reviewsCount, likesCount, dislikesCount,
      myVote,
      createdAt,
      updatedAt,
      deletedAt
    } = row

    return {
      id,
      brand,
      name,
      rating: rating ?? 0.0,

      counts: {
        reviews: reviewsCount,
        likes: likesCount,
        dislikes: dislikesCount
      },

      votes: {
        votes: likesCount - dislikesCount,
        myVote: myVote === 1 ? true : myVote === -1 ? false : null
      },

      audit: {
        createdAt,
        updatedAt,
        deletedAt
      }
    }
  }
}

type FragranceSummary = Omit<Fragrance,
'traits' |
'notes' |
'accords' |
'images' |
'reviews' |
'reviewDistribution' |
'myReview'>

type FragranceSummaryEdge = Omit<FragranceEdge, 'node'> & { node: FragranceSummary }
