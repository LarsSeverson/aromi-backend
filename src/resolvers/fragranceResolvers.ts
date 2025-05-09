import { encodeCursor } from '@src/common/cursor'
import { extractPaginationParams, newPage, type Page, type PaginationParams } from '@src/common/pagination'
import { type QueryResolvers, SortBy } from '@src/generated/gql-types'
import { type FragranceSummary, type FragranceSummaryEdge } from '@src/schemas/fragrance/mappers'
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

    const paginationParams = extractPaginationParams(input)

    return await services
      .fragrance
      .withMe(me)
      .list(paginationParams)
      .match(rows =>
        this
          .toPage(rows
            .map(row => this
              .summaryToEdge(this
                .rowToSummary(row), paginationParams))
          , paginationParams),
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

  private summaryToEdge (summary: FragranceSummary, paginationParams: PaginationParams): FragranceSummaryEdge {
    const { sortParams } = paginationParams
    const { column } = sortParams

    const sortValue = column === SortBy.Id ? summary.id : summary.audit[column]
    const cursor = encodeCursor(sortValue, summary.id)

    return { node: summary, cursor }
  }

  private toPage (edges: FragranceSummaryEdge[], paginationParams: PaginationParams): Page<FragranceSummary> {
    const { first, cursor } = paginationParams
    const page = newPage({ first, cursor, edges })

    return page
  }
}
