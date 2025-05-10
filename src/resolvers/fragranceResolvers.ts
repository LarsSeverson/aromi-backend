import { encodeCursor } from '@src/common/cursor'
import { ApiError } from '@src/common/error'
import { mergeAllSignedSrcs } from '@src/common/images'
import { extractPaginationParams, newPage, type Page, type PaginationParams } from '@src/common/pagination'
import { type FragranceTraitEnum } from '@src/db/schema'
import { FragranceTraitType, type QueryResolvers, type FragranceResolvers as FragranceFieldResolvers, SortBy, type FragranceImage, type FragranceImageEdge, type FragranceReviewDistribution, type FragranceTrait, type FragranceAccord, type FragranceAccordEdge } from '@src/generated/gql-types'
import { type FragranceReviewSummaryEdge, type FragranceReviewSummary, type FragranceSummary, type FragranceSummaryEdge } from '@src/schemas/fragrance/mappers'
import { type FragranceReviewDistRow, type FragranceImageRow, type FragranceRow, type FragranceReviewRow, type FragranceTraitRow, type FragranceAccordRow } from '@src/services/fragranceService'
import { ResultAsync } from 'neverthrow'

export class FragranceResolvers {
  fragrance: QueryResolvers['fragrance'] = async (parent, args, context, info) => {
    const { id } = args
    const { services, me } = context

    return await services
      .fragrance
      .withMe(me)
      .getById(id)
      .match(
        row => this.mapFragranceRowToFragranceSummary(row),
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
      .match(
        rows => this.mapFragranceRowsToPage(rows, paginationParams),
        error => { throw error }
      )
  }

  fragranceTraits: FragranceFieldResolvers['traits'] = async (parent, args, context, info) => {
    const { id } = parent
    const { loaders, me } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .withMe(me)
          .traits
          .load({ fragranceId: id }),
        error => ApiError.fromDatabase(error as Error)
      )
      .match(
        rows => this.mapFragranceTraitRowsToFragranceTraits(rows),
        error => { throw error }
      )
  }

  fragranceImages: FragranceFieldResolvers['images'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders, sources } = context

    const paginationParams = extractPaginationParams(input)

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .withPagination(paginationParams)
          .images
          .load({ fragranceId: id }),
        error => ApiError.fromDatabase(error as Error)
      )
      .match(
        async rows => {
          const page = this.mapFragranceImageRowsToPage(rows, paginationParams)
          await mergeAllSignedSrcs({ s3: sources.s3, on: page.edges.map(e => e.node) })

          return page
        },
        error => { throw error }
      )
  }

  fragranceAccords: FragranceFieldResolvers['accords'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { me, loaders } = context
    const { pagination: paginationInput } = input ?? {}

    const paginationParams = extractPaginationParams(paginationInput)

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .withMe(me)
          .withPagination(paginationParams)
          .accords
          .load({ fragranceId: id }),
        error => ApiError.fromDatabase(error as Error)
      )
      .match(
        rows => this.mapFragranceAccordRowsToPage(rows, paginationParams),
        error => { throw error }
      )
  }

  fragranceReviews: FragranceFieldResolvers['reviews'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders, me } = context

    const paginationParams = extractPaginationParams(input)

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .withMe(me)
          .withPagination(paginationParams)
          .reviews
          .load({ fragranceId: id }),
        error => ApiError.fromDatabase(error as Error)
      )
      .match(
        rows => this.mapFragranceReviewRowsToPage(rows, paginationParams),
        error => { throw error }
      )
  }

  fragranceReviewDistribution: FragranceFieldResolvers['reviewDistribution'] = async (parent, args, context, info) => {
    const { id } = parent
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .reviewDistributions
          .load({ fragranceId: id }),
        error => ApiError.fromDatabase(error as Error)
      )
      .match(
        rows => this.mapDistRowsToDist(rows),
        error => { throw error }
      )
  }

  private mapFragranceRowsToPage (rows: FragranceRow[], paginationParams: PaginationParams): Page<FragranceSummary> {
    const { first, cursor } = paginationParams

    const edges = rows.map(row => this.mapFragranceSummaryToEdge(this.mapFragranceRowToFragranceSummary(row), paginationParams))
    const page = newPage({ first, cursor, edges })

    return page
  }

  private mapFragranceImageRowsToPage (rows: FragranceImageRow[], paginationParams: PaginationParams): Page<FragranceImage> {
    const { first, cursor } = paginationParams

    const edges = rows.map(row => this.mapFragranceImageToEdge(this.mapFragranceImageRowToFragranceImage(row), paginationParams))
    const page = newPage({ first, cursor, edges })

    return page
  }

  private mapFragranceAccordRowsToPage (rows: FragranceAccordRow[], paginationParams: PaginationParams): Page<FragranceAccord> {
    const { first, cursor } = paginationParams

    const edges = rows.map(row => this.mapFragranceAccordToEdge(this.mapFragranceAccordRowToFragranceAccord(row), paginationParams))
    const page = newPage({ first, cursor, edges })

    return page
  }

  private mapFragranceReviewRowsToPage (rows: FragranceReviewRow[], paginationParams: PaginationParams): Page<FragranceReviewSummary> {
    const { first, cursor } = paginationParams

    const edges = rows.map(row => this.mapFragranceReviewSummaryToEdge(this.mapFragranceReviewRowToFragranceReviewSummary(row), paginationParams))
    const page = newPage({ first, cursor, edges })

    return page
  }

  private mapFragranceSummaryToEdge (summary: FragranceSummary, paginationParams: PaginationParams): FragranceSummaryEdge {
    const { sortParams } = paginationParams
    const { column } = sortParams

    const sortValue = column === SortBy.Id ? summary.id : summary.audit[column]
    const cursor = encodeCursor(sortValue, summary.id)

    return { node: summary, cursor }
  }

  private mapFragranceImageToEdge (image: FragranceImage, paginationParams: PaginationParams): FragranceImageEdge {
    const { sortParams } = paginationParams
    const { column } = sortParams

    const sortValue = column === SortBy.Id ? image.id : image.audit[column]
    const cursor = encodeCursor(sortValue, image.id)

    return { node: image, cursor }
  }

  private mapFragranceAccordToEdge (accord: FragranceAccord, paginationParams: PaginationParams): FragranceAccordEdge {
    const { sortParams } = paginationParams
    const { column } = sortParams

    const sortValue = column === SortBy.Id ? accord.id : accord.audit[column]
    const cursor = encodeCursor(sortValue, accord.id)

    return { node: accord, cursor }
  }

  private mapFragranceReviewSummaryToEdge (review: FragranceReviewSummary, paginationParams: PaginationParams): FragranceReviewSummaryEdge {
    const { sortParams } = paginationParams
    const { column } = sortParams

    const sortValue = column === SortBy.Id ? review.id : review.audit[column]
    const cursor = encodeCursor(sortValue, review.id)

    return { node: review, cursor }
  }

  private mapFragranceRowToFragranceSummary (row: FragranceRow): FragranceSummary {
    const {
      id,
      brand, name, rating, reviewsCount,
      voteScore, likesCount, dislikesCount, myVote,
      createdAt,
      updatedAt,
      deletedAt
    } = row

    return {
      id,
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
        createdAt,
        updatedAt,
        deletedAt
      }
    }
  }

  private mapFragranceTraitRowsToFragranceTraits (rows: FragranceTraitRow[]): FragranceTrait[] {
    return rows.map(({ trait, value, myVote }) => ({ type: FRAGRANCE_TRAIT_TO_TYPE[trait], value, myVote }))
  }

  private mapFragranceAccordRowToFragranceAccord (row: FragranceAccordRow): FragranceAccord {
    const {
      id, accordId,
      name, color,
      votes, myVote,
      createdAt, updatedAt, deletedAt
    } = row

    return {
      id,
      accordId,
      name,
      color,
      votes,
      myVote: myVote != null,

      audit: {
        createdAt,
        updatedAt,
        deletedAt
      }
    }
  }

  private mapFragranceImageRowToFragranceImage (row: FragranceImageRow): FragranceImage {
    const {
      id, s3Key,
      createdAt, updatedAt, deletedAt
    } = row

    return {
      id,
      src: s3Key,
      alt: '', // TODO:

      audit: {
        createdAt,
        updatedAt,
        deletedAt
      }
    }
  }

  private mapFragranceReviewRowToFragranceReviewSummary (row: FragranceReviewRow): FragranceReviewSummary {
    const {
      id,
      rating, reviewText,
      voteScore, likesCount, dislikesCount, myVote,
      createdAt, updatedAt, deletedAt
    } = row

    return {
      id,
      rating,
      review: reviewText,
      votes: {
        score: voteScore,
        likesCount,
        dislikesCount,
        myVote: myVote === 1 ? true : myVote === -1 ? false : null
      },
      audit: {
        createdAt,
        updatedAt,
        deletedAt
      }
    }
  }

  private mapDistRowsToDist (rows: FragranceReviewDistRow[]): FragranceReviewDistribution {
    const ratingKeys: Record<number, keyof FragranceReviewDistribution> = {
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five'
    }

    return rows
      .reduce((acc, { rating, count }) => {
        const key = ratingKeys[rating]
        if (key != null) acc[key] = count
        return acc
      }, { one: 0, two: 0, three: 0, four: 0, five: 0 })
  }
}

export const FRAGRANCE_TRAIT_TO_TYPE: Record<FragranceTraitEnum, FragranceTraitType> = {
  allure: FragranceTraitType.Allure,
  sillage: FragranceTraitType.Sillage,
  balance: FragranceTraitType.Balance,
  longevity: FragranceTraitType.Longevity,
  gender: FragranceTraitType.Gender,
  complexity: FragranceTraitType.Complexity
} as const
