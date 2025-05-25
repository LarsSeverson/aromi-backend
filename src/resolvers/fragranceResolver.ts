import { mergeAllSignedSrcs } from '@src/common/images'
import { getPaginationParams } from '@src/common/pagination'
import { type FragranceTraitEnum } from '@src/db/schema'
import { FragranceTraitType, type QueryResolvers, type FragranceResolvers as FragranceFieldResolvers, type FragranceImage, type FragranceReviewDistribution, type FragranceTrait, type FragranceAccord, type MutationResolvers, type VoteSortBy } from '@src/generated/gql-types'
import { type FragranceReviewSummary, type FragranceSummary } from '@src/schemas/fragrance/mappers'
import { type FragranceReviewDistRow, type FragranceImageRow, type FragranceRow, type FragranceTraitRow, type FragranceAccordRow } from '@src/services/fragranceService'
import { ResultAsync } from 'neverthrow'
import { ApiResolver } from './apiResolver'
import { type FragranceReviewRow } from '@src/services/reviewService'
import { GQL_NOTE_LAYER_TO_DB_NOTE_LAYER, mapFragranceNoteRowToFragranceNote } from './noteResolver'

export class FragranceResolver extends ApiResolver {
  fragrance: QueryResolvers['fragrance'] = async (parent, args, context, info) => {
    const { id } = args
    const { services } = context

    return await services
      .fragrance
      .find({ id })
      .match(
        mapFragranceRowToFragranceSummary,
        error => { throw error }
      )
  }

  fragrances: QueryResolvers['fragrances'] = async (parent, args, context, info) => {
    const { input } = args
    const { services } = context

    const paginationParams = getPaginationParams(input)

    return await services
      .fragrance
      .list(paginationParams)
      .match(
        rows => this
          .mapToPage({
            rows,
            paginationParams,
            mapFn: mapFragranceRowToFragranceSummary
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
        mapFragranceTraitRowsToFragranceTraits,
        error => { throw error }
      )
  }

  fragranceImages: FragranceFieldResolvers['images'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders, sources } = context

    const paginationParams = getPaginationParams(input)

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
              mapFn: mapFragranceImageRowToFragranceImage
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

    const { pagination: paginationInput = null, fill } = input ?? {}
    const paginationParams = getPaginationParams<VoteSortBy>(paginationInput)

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
            mapFn: mapFragranceAccordRowToFragranceAccord
          }),
        error => { throw error }
      )
  }

  fragranceNotes: FragranceFieldResolvers['notes'] = (parent, args, context, info) => ({ parent })

  fragranceReviews: FragranceFieldResolvers['reviews'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const paginationParams = getPaginationParams(input)

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
            mapFn: mapFragranceReviewRowToFragranceReviewSummary
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
        mapDistRowsToDist,
        error => { throw error }
      )
  }

  voteOnFragrance: MutationResolvers['voteOnFragrance'] = async (_, args, context, info) => {
    const { input } = args
    const { services } = context

    const { fragranceId, vote } = input

    return await services
      .fragrance
      .vote({ fragranceId, vote: vote ?? null })
      .match(
        mapFragranceRowToFragranceSummary,
        error => { throw error }
      )
  }

  voteOnTrait: MutationResolvers['voteOnTrait'] = async (_, args, context, info) => {
    const { input } = args
    const { services } = context

    const { fragranceTraitId, vote } = input

    return await services
      .fragrance
      .voteOnTrait({ fragranceTraitId, vote })
      .match(
        mapFragranceTraitRowToFragranceTrait,
        error => { throw error }
      )
  }

  voteOnAccord: MutationResolvers['voteOnAccord'] = async (_, args, context, info) => {
    const { input } = args
    const { services } = context

    const { fragranceId, accordId, vote } = input

    return await services
      .fragrance
      .voteOnAccord({ fragranceId, accordId, vote: vote ?? null })
      .match(
        mapFragranceAccordRowToFragranceAccord,
        error => { throw error }
      )
  }

  voteOnNote: MutationResolvers['voteOnNote'] = async (_, args, context, info) => {
    const { input } = args
    const { services } = context

    const { fragranceId, noteId, layer, vote } = input

    return await services
      .fragrance
      .voteOnNote({
        fragranceId,
        noteId,
        layer: GQL_NOTE_LAYER_TO_DB_NOTE_LAYER[layer],
        vote: vote ?? null
      })
      .match(
        mapFragranceNoteRowToFragranceNote,
        error => { throw error }
      )
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

export const mapFragranceRowToFragranceSummary = (row: FragranceRow): FragranceSummary => {
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

export const mapFragranceTraitRowToFragranceTrait = (row: FragranceTraitRow): FragranceTrait => {
  const { trait, voteScore, myVote } = row
  return {
    type: FRAGRANCE_TRAIT_TO_TYPE[trait],
    score: voteScore,
    myVote
  }
}

export const mapFragranceTraitRowsToFragranceTraits = (rows: FragranceTraitRow[]): FragranceTrait[] => {
  return rows.map(mapFragranceTraitRowToFragranceTrait)
}

export const mapFragranceAccordRowToFragranceAccord = (row: FragranceAccordRow): FragranceAccord => {
  const {
    id, accordId,
    name, color,
    voteScore, likesCount, dislikesCount, myVote,
    createdAt, updatedAt, deletedAt,
    isFill
  } = row

  return {
    id,
    accordId,
    name,
    color,

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
    },

    isFill: isFill ?? false
  }
}

export const mapFragranceImageRowToFragranceImage = (row: FragranceImageRow): FragranceImage => {
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

export const mapFragranceReviewRowToFragranceReviewSummary = (row: FragranceReviewRow): FragranceReviewSummary => {
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

export const mapDistRowsToDist = (rows: FragranceReviewDistRow[]): FragranceReviewDistribution => {
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
