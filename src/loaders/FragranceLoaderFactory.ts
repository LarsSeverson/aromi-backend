import DataLoader from 'dataloader'
import { LoaderFactory } from './LoaderFactory'
import { type FragranceRow } from '@src/services/FragranceService'
import { type FragranceImageRow } from '@src/services/repositories/FragranceImageRepo'
import { type FragranceTraitRow } from '@src/services/repositories/FragranceTraitsRepo'
import { type FragranceAccordRow } from '@src/services/repositories/FragranceAccordsRepo'
import { type FragranceNoteRow } from '@src/services/repositories/FragranceNotesRepo'
import { type NoteLayerEnum } from '@src/db/schema'
import { type FragranceReviewDistRow, type FragranceReviewRow } from '@src/services/repositories/FragranceReviewsRepo'
import { ApiError, throwError } from '@src/common/error'
import { ResultAsync } from 'neverthrow'
import { type ParsedPaginationInput } from '@src/factories/PagiFactory'

export interface FragranceLoaderKey { fragranceId: number }

interface FragranceLoaders {
  fragrance: DataLoader<FragranceLoaderKey, FragranceRow>

  images: DataLoader<FragranceLoaderKey, FragranceImageRow[]>

  traits: DataLoader<FragranceLoaderKey, FragranceTraitRow[]>

  accords: DataLoader<FragranceLoaderKey, FragranceAccordRow[]>
  fillerAccords: DataLoader<FragranceLoaderKey, FragranceAccordRow[]>

  notes: DataLoader<FragranceLoaderKey, FragranceNoteRow[]>
  fillerNotes: DataLoader<FragranceLoaderKey, FragranceNoteRow[]>

  reviews: DataLoader<FragranceLoaderKey, FragranceReviewRow[]>
  reviewDistributions: DataLoader<FragranceLoaderKey, FragranceReviewDistRow[]>
  myReview: DataLoader<FragranceLoaderKey, FragranceReviewRow>
}

export interface GetImagesLoaderParams {
  pagination: ParsedPaginationInput
}

export interface GetAccordsLoaderParams {
  pagination: ParsedPaginationInput
}

export interface GetNotesLoaderParams {
  layer: NoteLayerEnum
  pagination: ParsedPaginationInput
}

export interface GetReviewsLoaderParams {
  pagination: ParsedPaginationInput
}

export class FragranceLoaderFactory extends LoaderFactory<FragranceLoaderKey> {
  getFragranceLoader (): FragranceLoaders['fragrance'] {
    const key = this.generateKey('fragrance')
    return this
      .getLoader(
        key,
        () => this.createFragranceLoader()
      )
  }

  getImagesLoader (params: GetImagesLoaderParams): FragranceLoaders['images'] {
    const key = this.generateKey('images', params)
    return this
      .getLoader(
        key,
        () => this.createImagesLoader(params)
      )
  }

  getTraitsLoader (): FragranceLoaders['traits'] {
    const key = this.generateKey('traits')
    return this
      .getLoader(
        key,
        () => this.createTraitsLoader()
      )
  }

  getAccordsLoader (params: GetAccordsLoaderParams): FragranceLoaders['accords'] {
    const key = this.generateKey('accords', params)
    return this
      .getLoader(
        key,
        () => this.createAccordsLoader(params)
      )
  }

  getFillerAccordsLoader (params: GetAccordsLoaderParams): FragranceLoaders['fillerAccords'] {
    const key = this.generateKey('fillerAccords', params)
    return this
      .getLoader(
        key,
        () => this.createFillerAccordsLoader(params)
      )
  }

  getNotesLoader (params: GetNotesLoaderParams): FragranceLoaders['notes'] {
    const key = this.generateKey('notes', params)
    return this
      .getLoader(
        key,
        () => this.createNotesLoader(params)
      )
  }

  getFillerNotesLoader (params: GetNotesLoaderParams): FragranceLoaders['fillerNotes'] {
    const key = this.generateKey('fillerNotes', params)
    return this
      .getLoader(
        key,
        () => this.createFillerNotesLoader(params)
      )
  }

  getReviewsLoader (params: GetReviewsLoaderParams): FragranceLoaders['reviews'] {
    const key = this.generateKey('reviews', params)
    return this
      .getLoader(
        key,
        () => this.createReviewsLoader(params)
      )
  }

  getReviewDistributionsLoader (): FragranceLoaders['reviewDistributions'] {
    const key = this.generateKey('reviewDistributions')
    return this
      .getLoader(
        key,
        () => this.createReviewDistributionsLoader()
      )
  }

  getMyReviewsLoader (): FragranceLoaders['myReview'] {
    const key = this.generateKey('myReview')
    return this
      .getLoader(
        key,
        () => this.createMyReviewsLoader()
      )
  }

  private createFragranceLoader (): FragranceLoaders['fragrance'] {
    return new DataLoader<FragranceLoaderKey, FragranceRow>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .services
        .fragrance
        .find(eb => eb('fragrances.id', 'in', fragranceIds))
        .match(
          rows => {
            const fragrancesMap = new Map(rows.map(row => [row.id, row]))
            return fragranceIds.map(id => {
              const fragrance = fragrancesMap.get(id)
              if (fragrance == null) {
                throw new ApiError(
                  'NOT_FOUND',
                  "We couldn't find this fragrance",
                  404
                )
              }
              return fragrance
            })
          },
          throwError
        )
    })
  }

  private createImagesLoader (params: GetImagesLoaderParams): FragranceLoaders['images'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceImageRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await ResultAsync
        .combine(
          fragranceIds
            .map(id => this
              .services
              .fragrance
              .images
              .find(
                eb => eb('fragranceImages.fragranceId', '=', id),
                { pagination }
              )
            )
        )
        .match(
          rows => rows,
          throwError
        )
    })
  }

  private createTraitsLoader (): FragranceLoaders['traits'] {
    return new DataLoader<FragranceLoaderKey, FragranceTraitRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await ResultAsync
        .combine(
          fragranceIds.map(id => this.services
            .fragrance
            .traits
            .find(
              eb => eb('fragranceTraits.fragranceId', '=', id)
            )
          )
        )
        .match(
          rows => rows,
          throwError
        )
    })
  }

  private createAccordsLoader (params: GetAccordsLoaderParams): FragranceLoaders['accords'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceAccordRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await ResultAsync
        .combine(
          fragranceIds
            .map(id => this
              .services
              .fragrance
              .accords
              .find(
                eb => eb('fragranceAccords.fragranceId', '=', id),
                { pagination }
              )
            )
        )
        .match(
          rows => rows,
          throwError
        )
    })
  }

  private createFillerAccordsLoader (params: GetAccordsLoaderParams): FragranceLoaders['fillerAccords'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceAccordRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await ResultAsync
        .combine(
          fragranceIds
            .map(
              id => this
                .services
                .fragrance
                .accords
                .fillers
                .fill(id, pagination)
            )
        )
        .match(
          rows => rows,
          throwError
        )
    })
  }

  private createNotesLoader (params: GetNotesLoaderParams): FragranceLoaders['notes'] {
    const { layer, pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceNoteRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await ResultAsync
        .combine(
          fragranceIds.map(id => this
            .services
            .fragrance
            .notes
            .find(
              eb => eb.and([
                eb('fragranceNotes.fragranceId', '=', id),
                eb('fragranceNotes.layer', '=', layer)
              ]),
              { pagination }
            )
          )
        )
        .match(
          rows => rows,
          throwError
        )
    })
  }

  private createFillerNotesLoader (params: GetNotesLoaderParams): FragranceLoaders['fillerNotes'] {
    const { layer, pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceNoteRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await ResultAsync
        .combine(
          fragranceIds.map(id => this
            .services
            .fragrance
            .notes
            .fillers
            .fill(
              id,
              layer,
              pagination
            )
          )
        )
        .match(
          rows => rows,
          throwError
        )
    })
  }

  private createReviewsLoader (params: GetReviewsLoaderParams): FragranceLoaders['reviews'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceReviewRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await ResultAsync
        .combine(
          fragranceIds.map(id => this
            .services
            .fragrance
            .reviews
            .find(
              eb => eb('fragranceReviews.fragranceId', '=', id),
              { pagination }
            )
          )
        )
        .match(
          rows => rows,
          throwError
        )
    })
  }

  private createReviewDistributionsLoader (): FragranceLoaders['reviewDistributions'] {
    return new DataLoader<FragranceLoaderKey, FragranceReviewDistRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await ResultAsync
        .combine(
          fragranceIds.map(id => this
            .services
            .fragrance
            .reviews
            .dist
            .find(
              eb => eb('fragranceReviews.fragranceId', '=', id),
              {
                extend: qb => qb
                  .groupBy(['fragranceId', 'rating'])
                  .orderBy('count', 'asc')
              }
            )
          )
        )
        .match(
          rows => rows,
          throwError
        )
    })
  }

  private createMyReviewsLoader (): FragranceLoaders['myReview'] {
    return new DataLoader<FragranceLoaderKey, FragranceReviewRow>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      const myId = this.services.fragrance.context.me?.id ?? null

      return await ResultAsync
        .combine(
          fragranceIds.map(id => this
            .services
            .fragrance
            .reviews
            .findOne(
              eb => eb.and([
                eb('fragranceReviews.userId', '=', myId),
                eb('fragranceReviews.fragranceId', '=', id)
              ])
            )
          )
        )
        .match(
          rows => rows,
          throwError
        )
    })
  }

  private getFragranceIds (keys: readonly FragranceLoaderKey[]): Array<FragranceLoaderKey['fragranceId']> {
    return keys.map(({ fragranceId }) => fragranceId)
  }
}
