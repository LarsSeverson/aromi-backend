import { type QueryResolvers, type FragranceResolvers as FragranceFieldResolvers, type FragranceImage, FragranceTraitType, type FragranceTrait, type FragranceAccord, type FragranceReviewDistribution, type MutationResolvers } from '@src/generated/gql-types'
import { ApiResolver, SortByColumn, VoteSortByColumn } from './apiResolver'
import { type FragranceRow } from '@src/services/FragranceService'
import { type FragranceSummary } from '@src/schemas/fragrance/mappers'
import { okAsync, ResultAsync } from 'neverthrow'
import { type FragranceImageRow } from '@src/services/repositories/FragranceImageRepo'
import { type FragranceTraitEnum } from '@src/db/schema'
import { type FragranceTraitRow } from '@src/services/repositories/FragranceTraitsRepo'
import { type FragranceAccordRow } from '@src/services/repositories/FragranceAccordsRepo'
import { type FragranceReviewDistRow } from '@src/services/repositories/FragranceReviewsRepo'
import { mapFragranceReviewRowToFragranceReviewSummary } from './reviewResolvers'
import { mapFragranceVoteRowToFragranceVoteSummary } from './fragranceVoteResolver'
import { ApiError } from '@src/common/error'

// const ALLOWED_FRAGRANCE_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

export class FragranceResolver extends ApiResolver {
  fragrance: QueryResolvers['fragrance'] = async (parent, args, context, info) => {
    const { id } = args
    const { services } = context

    return await services
      .fragrance
      .findOne(eb => eb('fragrances.id', '=', id))
      .match(
        mapFragranceRowToFragranceSummary,
        error => { throw error }
      )
  }

  fragrances: QueryResolvers['fragrances'] = async (parent, args, context, info) => {
    const { input } = args
    const { services } = context

    const normalizedInput = this
      .paginationFactory
      .normalize(input, input?.sort?.by ?? 'UPDATED', (decoded) => String(decoded))

    const parsedInput = this
      .paginationFactory
      .parse(normalizedInput, () => SortByColumn[normalizedInput.sort.by])

    return await services
      .fragrance
      .paginate(parsedInput)
      .match(
        rows => this
          .newPage(
            rows,
            normalizedInput,
            (row) => row[parsedInput.column],
            mapFragranceRowToFragranceSummary
          ),
        error => { throw error }
      )
  }

  searchFragrances: QueryResolvers['searchFragrances'] = async (parent, args, context, info) => {
    const { input } = args
    const { services } = context
    const { fragrance } = services

    const query = input?.query ?? undefined
    const pagination = input?.pagination

    const normalizedInput = this
      .paginationFactory
      .normalize(
        pagination,
        pagination?.sort?.by ?? 'UPDATED',
        (decoded) => String(decoded)
      )

    const parsedInput = this
      .paginationFactory
      .parse(normalizedInput, () => SortByColumn[normalizedInput.sort.by])

    const limit = parsedInput.first + 1
    const offset = parsedInput.offset != null ? parsedInput.offset + 1 : 0

    return await fragrance
      .searcher
      .search({ query, limit, offset })
      .map(docs => docs.hits.map(doc => doc.id))
      .andThen((ids) => fragrance.find(eb => eb('fragrances.id', 'in', ids)))
      .match(
        rows => this
          .newPage(
            rows,
            parsedInput,
            (row, idx) => `${row.id}|${idx + offset}`,
            mapFragranceRowToFragranceSummary
          ),
        error => { throw error }
      )
  }

  fragranceImages: FragranceFieldResolvers['images'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const normalizedInput = this
      .paginationFactory
      .normalize(input, input?.sort?.by ?? 'UPDATED', (decoded) => String(decoded))

    const parsedInput = this
      .paginationFactory
      .parse(normalizedInput, () => SortByColumn[normalizedInput.sort.by])

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getImagesLoader({ pagination: parsedInput })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            normalizedInput,
            (row) => row[parsedInput.column],
            mapFragranceImageRowToFragranceImage
          ),
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

  fragranceAccords: FragranceFieldResolvers['accords'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const { pagination, fill } = input ?? {}
    let isFill = false

    const normalizedInput = this
      .paginationFactory
      .normalize(
        pagination,
        pagination?.sort?.by ?? 'VOTES',
        (decoded) => {
          const [value, fillFlag] = String(decoded).split('|')
          isFill = fillFlag === '1'
          return value
        }
      )

    const parsedInput = this
      .paginationFactory
      .parse(normalizedInput, () => VoteSortByColumn[normalizedInput.sort.by])

    const loader = isFill
      ? loaders.fragrance.getFillerAccordsLoader({ pagination: parsedInput })
      : loaders.fragrance.getAccordsLoader({ pagination: parsedInput })

    return await ResultAsync
      .fromPromise(
        loader.load({ fragranceId: id }),
        error => error
      )
      .andThen(rows => {
        if (isFill) return okAsync(rows)
        if (!(fill ?? false)) return okAsync(rows)
        if (rows.length >= parsedInput.first) return okAsync(rows)

        const needed = parsedInput.first - rows.length
        const fillInput = { ...parsedInput, first: needed }

        return ResultAsync
          .fromPromise(
            loaders
              .fragrance
              .getFillerAccordsLoader({ pagination: fillInput })
              .load({ fragranceId: id }),
            error => error
          )
          .map(filled => rows.concat(filled))
      })
      .match(
        rows => this
          .newPage(
            rows,
            parsedInput,
            (row) => `${row[parsedInput.column]}|${row.isFill ? '1' : '0'}`,
            mapFragranceAccordRowToFragranceAccord
          ),
        error => { throw error }
      )
  }

  fragranceNotes: FragranceFieldResolvers['notes'] = (parent, args, context, info) => ({ parent })

  fragranceReviews: FragranceFieldResolvers['reviews'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const normalizedInput = this
      .paginationFactory
      .normalize(input, input?.sort?.by ?? 'VOTES', (decoded) => String(decoded))

    const parsedInput = this
      .paginationFactory
      .parse(normalizedInput, () => VoteSortByColumn[normalizedInput.sort.by])

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getReviewsLoader({ pagination: parsedInput })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            parsedInput,
            (row) => String(row[parsedInput.column]),
            mapFragranceReviewRowToFragranceReviewSummary
          ),
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

  myReview: FragranceFieldResolvers['myReview'] = async (parent, args, context, info) => {
    const { id } = parent
    const { me, loaders } = context

    if (me == null) return null

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getMyReviewsLoader()
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        (row) => {
          if (row == null) return null
          return mapFragranceReviewRowToFragranceReviewSummary(row)
        },
        error => { throw error }
      )
  }

  // createFragranceImage: MutationResolvers['createFragranceImage'] = async (_, args, context, info) => {
  //   const { input } = args
  //   const { services } = context
  //   const { asset } = services

  //   const { fragranceId, fileSize, fileType } = input

  //   if (!ALLOWED_FRAGRANCE_IMAGE_TYPES.includes(fileType)) {
  //     throw new ApiError(
  //       'INVALID_INPUT',
  //       'This file type is not allowed for fragrance images',
  //       400,
  //       `Attempt to upload type: ${fileType} for fragrance image`
  //     )
  //   }

  //   const key = asset.genKey(`fragrance_images/${String(fragranceId)}`)

  //   return await services
  //     .asset
  //     .presignUpload({ key, fileSize, fileType })
  //     .map(payload => ({ ...payload, s3Key: key }))
  //     .match(
  //       payload => payload,
  //       error => { throw error }
  //     )
  // }

  // confirmFragranceImage: MutationResolvers['confirmFragranceImage'] = async (_, args, context, info) => {
  //   const { input } = args
  //   const { services } = context
  //   const { asset, fragrance } = services

  //   const { fragranceId, s3Key } = input

  //   const validate = await asset.validateImage(s3Key)

  //   if (validate.isErr()) {
  //     if (validate.error.status !== 404) {
  //       await asset.delete(s3Key)
  //     }

  //     throw validate.error
  //   }

  //   return await fragrance
  //     .images
  //     .create({ fragranceId, s3Key })
  //     .match(
  //       (row) => asset.signAsset(mapFragranceImageRowToFragranceImage(row)),
  //       error => { throw error }
  //     )
  // }

  voteOnFragrance: MutationResolvers['voteOnFragrance'] = async (_, args, context, info) => {
    const { input } = args
    const { services, me } = context

    if (me == null) {
      throw new ApiError(
        '403',
        'You must be logged in vote on a fragrance',
        403
      )
    }

    const userId = me.id
    const { fragranceId, vote } = input

    const { voteValue, deletedAt } = this.getVoteMutationValues(vote)

    return await services
      .user
      .votes
      .create({ fragranceId, userId, vote: voteValue, deletedAt })
      .match(
        mapFragranceVoteRowToFragranceVoteSummary,
        error => { throw error }
      )
  }

  // voteOnTrait: MutationResolvers['voteOnTrait'] = async (_, args, context, info) => {
  //   const { input } = args
  //   const { services } = context

  //   const { fragranceTraitId, vote } = input

  //   return await services
  //     .fragrance
  //     .voteOnTrait({ fragranceTraitId, vote })
  //     .match(
  //       mapFragranceTraitRowToFragranceTrait,
  //       error => { throw error }
  //     )
  // }

  // voteOnAccord: MutationResolvers['voteOnAccord'] = async (_, args, context, info) => {
  //   const { input } = args
  //   const { services } = context

  //   const { fragranceId, accordId, vote } = input

  //   return await services
  //     .fragrance
  //     .voteOnAccord({ fragranceId, accordId, vote: vote ?? null })
  //     .match(
  //       mapFragranceAccordRowToFragranceAccord,
  //       error => { throw error }
  //     )
  // }

  // voteOnNote: MutationResolvers['voteOnNote'] = async (_, args, context, info) => {
  //   const { input } = args
  //   const { services } = context

  //   const { fragranceId, noteId, layer, vote } = input

  //   return await services
  //     .fragrance
  //     .voteOnNote({
  //       fragranceId,
  //       noteId,
  //       layer: GQL_NOTE_LAYER_TO_DB_NOTE_LAYER[layer],
  //       vote: vote ?? null
  //     })
  //     .match(
  //       mapFragranceNoteRowToFragranceNote,
  //       error => { throw error }
  //     )
  // }

  // logFragranceView: MutationResolvers['logFragranceView'] = async (_, args, context, info) => {
  //   const { input } = args
  //   const { me, services } = context

  //   if (me == null) return false

  //   const { fragranceId } = input
  //   const userId = me.id

  //   return await services
  //     .fragrance
  //     .views
  //     .create({ fragranceId, userId })
  //     .match(
  //       _ => true,
  //       error => { throw error }
  //     )
  // }
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
      voteScore,
      likesCount,
      dislikesCount,
      myVote: myVote === 1 ? true : myVote === -1 ? false : null
    },

    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}

export const mapFragranceImageRowToFragranceImage = (row: FragranceImageRow): FragranceImage => {
  const {
    id, s3Key,
    primaryColor,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    src: s3Key,
    alt: '', // TODO:
    bg: primaryColor,

    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}

export const mapFragranceTraitRowToFragranceTrait = (row: FragranceTraitRow): FragranceTrait => {
  const { trait, voteScore, myVote } = row
  return {
    type: FRAGRANCE_TRAIT_TO_TYPE[trait],
    voteScore,
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
      voteScore,
      likesCount,
      dislikesCount,
      myVote: myVote === 1 ? true : myVote === -1 ? false : null
    },

    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt),

    isFill
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
