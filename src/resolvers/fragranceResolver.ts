import { type QueryResolvers, type FragranceResolvers as FragranceFieldResolvers, type FragranceImage, FragranceTraitType, type FragranceTrait, type FragranceAccord, type FragranceReviewDistribution, type MutationResolvers, type FragranceNotesResolvers, NoteLayer, type FragranceNote } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { type FragranceRow } from '@src/services/FragranceService'
import { type FragranceSummary } from '@src/schemas/fragrance/mappers'
import { ResultAsync } from 'neverthrow'
import { type FragranceImageRow } from '@src/services/repositories/FragranceImageRepo'
import { type NoteLayerEnum, type FragranceTraitEnum } from '@src/db/schema'
import { type FragranceTraitRow } from '@src/services/repositories/FragranceTraitsRepo'
import { type FragranceAccordRow } from '@src/services/repositories/FragranceAccordsRepo'
import { type FragranceReviewDistRow } from '@src/services/repositories/FragranceReviewsRepo'
import { mapFragranceReviewRowToFragranceReviewSummary } from './reviewResolvers'
import { mapFragranceVoteRowToFragranceVoteSummary } from './fragranceVoteResolver'
import { ApiError, throwError } from '@src/common/error'
import { type FragranceNoteRow } from '@src/services/repositories/FragranceNotesRepo'

export class FragranceResolver extends ApiResolver {
  fragrance: QueryResolvers['fragrance'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getFragranceLoader()
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        mapFragranceRowToFragranceSummary,
        throwError
      )
  }

  fragrances: QueryResolvers['fragrances'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const pagination = this.paginationFactory.process(input, 'UPDATED')

    return await services
      .fragrance
      .paginate(pagination)
      .match(
        rows => this
          .newPage(
            rows,
            pagination,
            (row) => String(row[pagination.column]),
            mapFragranceRowToFragranceSummary
          ),
        throwError
      )
  }

  fragranceImages: FragranceFieldResolvers['images'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services, loaders } = context

    const pagination = this.paginationFactory.process(input)

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getImagesLoader({ pagination })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            pagination,
            (row) => String(row[pagination.column]),
            row => services.asset.publicize(mapFragranceImageRowToFragranceImage(row))
          ),
        throwError
      )
  }

  fragranceTraits: FragranceFieldResolvers['traits'] = async (
    parent,
    args,
    context,
    info
  ) => {
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
        throwError
      )
  }

  fragranceAccords: FragranceFieldResolvers['accords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const pagination = this.paginationFactory.process(input, 'VOTES')

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getAccordsLoader({ pagination })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            pagination,
            (row) => String(row[pagination.column]),
            mapFragranceAccordRowToFragranceAccord
          ),
        throwError
      )
  }

  fillerFragranceAccords: FragranceFieldResolvers['fillerAccords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const pagination = this.paginationFactory.process(input)

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getFillerAccordsLoader({ pagination })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this.newPage(
          rows,
          pagination,
          (row) => String(row.id),
          mapFragranceAccordRowToFragranceAccord
        ),
        throwError
      )
  }

  fragranceNotesParent: FragranceFieldResolvers['notes'] = (
    parent,
    args,
    context,
    info
  ) => ({ parent })

  fragranceNotes: FragranceNotesResolvers['top' | 'middle' | 'base'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent.parent
    const { input } = args
    const { services, loaders } = context

    const layer = info.fieldName as NoteLayerEnum

    const pagination = this.paginationFactory.process(input, 'VOTES')

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getNotesLoader({ layer, pagination })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this.newPage(
          rows,
          pagination,
          (row) => String(row[pagination.column]),
          (row) => mapFragranceNoteRowToFragranceNote(
            services.asset.publicizeField(row, 's3Key')
          )
        ),
        throwError
      )
  }

  fillerFragranceNotes: FragranceNotesResolvers['fillerTop' | 'fillerMiddle' | 'fillerBase'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent.parent
    const { input } = args
    const { services, loaders } = context

    const layer = info.fieldName === 'fillerTop'
      ? 'top'
      : info.fieldName === 'fillerMiddle'
        ? 'middle'
        : 'base'

    const pagination = this.paginationFactory.process(input)

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getFillerNotesLoader({ pagination, layer })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this.newPage(
          rows,
          pagination,
          row => String(row.id),
          (row) => mapFragranceNoteRowToFragranceNote(
            services.asset.publicizeField(row, 's3Key')
          )
        ),
        throwError
      )
  }

  fragranceReviews: FragranceFieldResolvers['reviews'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const pagination = this.paginationFactory.process(input, 'VOTES')

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getReviewsLoader({ pagination })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            pagination,
            (row) => String(row[pagination.column]),
            mapFragranceReviewRowToFragranceReviewSummary
          ),
        throwError
      )
  }

  fragranceReviewDistribution: FragranceFieldResolvers['reviewDistribution'] = async (
    parent,
    args,
    context,
    info
  ) => {
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
        throwError
      )
  }

  myReview: FragranceFieldResolvers['myReview'] = async (
    parent,
    args,
    context,
    info
  ) => {
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
        throwError
      )
  }

  createFragranceReview: MutationResolvers['createFragranceReview'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before writing a review',
        403
      )
    }

    const userId = me.id
    const { fragranceId, rating, review } = input
    const updatedAt = new Date().toISOString()

    return await services
      .fragrance
      .reviews
      .upsert(
        {
          userId,
          fragranceId,
          rating,
          reviewText: review
        },
        oc => oc
          .columns(['userId', 'fragranceId'])
          .doUpdateSet({
            rating,
            reviewText: review,
            updatedAt
          })
      )
      .andThen((upsertedRow) => services
        .fragrance
        .reviews
        .findOne(
          eb => eb('fragranceReviews.id', '=', upsertedRow.id)
        )
      )
      .match(
        mapFragranceReviewRowToFragranceReviewSummary,
        throwError
      )
  }

  voteOnFragrance: MutationResolvers['voteOnFragrance'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services, me } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before voting on a fragrance',
        403
      )
    }

    const userId = me.id
    const { fragranceId, vote } = input

    return await services
      .fragrance
      .vote({ userId, fragranceId, vote })
      .match(
        mapFragranceVoteRowToFragranceVoteSummary,
        throwError
      )
  }

  voteOnTrait: MutationResolvers['voteOnTrait'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before voting on a characteristic',
        403
      )
    }

    const { fragranceTraitId, vote } = input
    const userId = me.id

    return await services
      .fragrance
      .traits
      .vote({ userId, traitId: fragranceTraitId, vote })
      .match(
        mapFragranceTraitRowToFragranceTrait,
        throwError
      )
  }

  voteOnAccord: MutationResolvers['voteOnAccord'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before voting on an accord',
        403
      )
    }

    const userId = me.id
    const { fragranceId, accordId, vote } = input

    return await services
      .fragrance
      .accords
      .vote({ userId, fragranceId, accordId, vote })
      .match(
        mapFragranceAccordRowToFragranceAccord,
        throwError
      )
  }

  voteOnNote: MutationResolvers['voteOnNote'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before voting on a note',
        403
      )
    }

    const userId = me.id
    const { fragranceId, noteId, layer: gqlLayer, vote } = input
    const layer = GQL_NOTE_LAYER_TO_DB_NOTE_LAYER[gqlLayer]

    return await services
      .fragrance
      .notes
      .vote({
        userId,
        fragranceId,
        noteId,
        layer,
        vote
      })
      .match(
        (row) => mapFragranceNoteRowToFragranceNote(
          services.asset.publicizeField(row, 's3Key')
        ),
        throwError
      )
  }

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
    width, height,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    src: s3Key,
    alt: '', // TODO:
    bg: primaryColor,
    width,
    height,

    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}

export const mapFragranceTraitRowToFragranceTrait = (row: FragranceTraitRow): FragranceTrait => {
  const { id, trait, voteScore, myVote } = row
  return {
    id,
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
    createdAt, updatedAt, deletedAt
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

    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}

export const DB_NOTE_LAYER_TO_GQL_NOTE_LAYER: Record<NoteLayerEnum, NoteLayer> = {
  top: NoteLayer.Top,
  middle: NoteLayer.Middle,
  base: NoteLayer.Base
} as const

export const GQL_NOTE_LAYER_TO_DB_NOTE_LAYER: Record<NoteLayer, NoteLayerEnum> = {
  TOP: 'top',
  MIDDLE: 'middle',
  BASE: 'base'
} as const

export const mapFragranceNoteRowToFragranceNote = (row: FragranceNoteRow): FragranceNote => {
  const {
    id, noteId,
    name, s3Key, layer,
    voteScore, likesCount, dislikesCount, myVote,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    noteId,
    name,
    layer: DB_NOTE_LAYER_TO_GQL_NOTE_LAYER[layer],
    thumbnail: s3Key,

    votes: {
      voteScore,
      likesCount,
      dislikesCount,
      myVote: myVote === 1 ? true : myVote === -1 ? false : null
    },

    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
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
