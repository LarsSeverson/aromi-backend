import { mergeAllSignedSrcs } from '@src/common/images'
import { extractPaginationParams } from '@src/common/pagination'
import { type FragranceTraitEnum } from '@src/db/schema'
import { FragranceTraitType, type QueryResolvers, type FragranceResolvers as FragranceFieldResolvers, type FragranceImage, type FragranceReviewDistribution, type FragranceTrait, type FragranceAccord } from '@src/generated/gql-types'
import { type FragranceReviewSummary, type FragranceSummary } from '@src/schemas/fragrance/mappers'
import { type FragranceReviewDistRow, type FragranceImageRow, type FragranceRow, type FragranceTraitRow, type FragranceAccordRow } from '@src/services/fragranceService'
import { ResultAsync } from 'neverthrow'
import { ApiResolver } from './apiResolver'
import { type FragranceReviewRow } from '@src/services/reviewService'

export class FragranceResolver extends ApiResolver {
  fragrance: QueryResolvers['fragrance'] = async (parent, args, context, info) => {
    const { id } = args
    const { services } = context

    return await services
      .fragrance
      .find({ id })
      .match(
        row => this.mapFragranceRowToFragranceSummary(row),
        error => { throw error }
      )
  }

  fragrances: QueryResolvers['fragrances'] = async (parent, args, context, info) => {
    const { input } = args
    const { services } = context

    const paginationParams = extractPaginationParams(input)

    return await services
      .fragrance
      .list(paginationParams)
      .match(
        rows => this
          .mapToPage({
            rows,
            paginationParams,
            mapFn: (row) => this.mapFragranceRowToFragranceSummary(row)
          }),
        error => { throw error }
      )
  }

  fragranceTraits: FragranceFieldResolvers['traits'] = async (parent, args, context, info) => {
    const { id } = parent
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getTraitsLoader()
          .load({ fragranceId: id }),
        error => error
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
          .getImagesLoader({ paginationParams })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        async rows => {
          const page = this
            .mapToPage({
              rows,
              paginationParams,
              mapFn: (row) => this.mapFragranceImageRowToFragranceImage(row)
            })

          await mergeAllSignedSrcs({ s3: sources.s3, on: page.edges.map(e => e.node) })

          return page
        },
        error => { throw error }
      )
  }

  fragranceAccords: FragranceFieldResolvers['accords'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const { pagination: paginationInput, fill } = input ?? {}
    const paginationParams = extractPaginationParams(paginationInput)

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getAccordsLoader({ paginationParams, fill: fill?.valueOf() })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this
          .mapToPage({
            rows,
            paginationParams,
            mapFn: (row) => this.mapFragranceAccordRowToFragranceAccord(row)
          }),
        error => { throw error }
      )
  }

  fragranceNotes: FragranceFieldResolvers['notes'] = (parent, args, context, info) => ({ parent })

  fragranceReviews: FragranceFieldResolvers['reviews'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const paginationParams = extractPaginationParams(input)

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getReviewsLoader({ paginationParams })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this
          .mapToPage({
            rows,
            paginationParams,
            mapFn: (row) => this.mapFragranceReviewRowToFragranceReviewSummary(row)
          }),
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
          .getReviewDistributionsLoader()
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this.mapDistRowsToDist(rows),
        error => { throw error }
      )
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
      createdAt, updatedAt, deletedAt,
      isFill
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
      },

      isFill: isFill ?? false
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
      text: reviewText,
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
