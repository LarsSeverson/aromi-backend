import { type Fragrance, type QueryResolvers } from '@src/generated/gql-types'
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
        row => this.mapFragranceRow(row),
        error => { throw error }
      )
  }

  private mapFragranceRow (row: FragranceRow): FragranceMapper {
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

type FragranceMapper = Omit<Fragrance,
'traits' |
'notes' |
'accords' |
'images' |
'reviews' |
'reviewDistribution' |
'myReview'>
