import { type UserCollectionResolvers as CollectionFieldResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { type CollectionItemRow } from '@src/services/collectionService'
import { type UserCollectionItemSummary } from '@src/schemas/user/mappers'
import { extractPaginationParams } from '@src/common/pagination'
import { ResultAsync } from 'neverthrow'

export class CollectionResolver extends ApiResolver {
  collectionItems: CollectionFieldResolvers['items'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const paginationParams = extractPaginationParams(input)

    return await ResultAsync
      .fromPromise(
        loaders
          .collection
          .getItemsLoader({ paginationParams })
          .load({ collectionId: id }),
        error => error
      )
      .match(
        rows => this
          .mapToPage({
            rows,
            paginationParams,
            mapFn: (row) => this.mapCollectionItemRowToCollectionItemSummary(row)
          }),
        error => { throw error }
      )
  }

  private mapCollectionItemRowToCollectionItemSummary (row: CollectionItemRow): UserCollectionItemSummary {
    const {
      id, fragranceId,
      brand, name, rating, reviewsCount,
      voteScore, likesCount, dislikesCount, myVote,
      createdAt, updatedAt, deletedAt,
      fCreatedAt, fUpdatedAt, fDeletedAt
    } = row

    return {
      id,
      fragrance: {
        id: fragranceId,
        brand,
        name,
        rating: rating ?? 0.0,
        reviewsCount,

        votes: {
          score: voteScore,
          likesCount,
          dislikesCount,
          myVote: myVote === 1 ? true : myVote === -1 ? false : null
        },

        audit: {
          createdAt: fCreatedAt, updatedAt: fUpdatedAt, deletedAt: fDeletedAt
        }
      },
      audit: {
        createdAt, updatedAt, deletedAt
      }
    }
  }
}
