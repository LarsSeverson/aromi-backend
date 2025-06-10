import DataLoader from 'dataloader'
import { LoaderFactory } from './LoaderFactory'
import { type FragranceRow } from '@src/services/FragranceService'
import { type FragranceImageRow } from '@src/services/repositories/FragranceImageRepo'
import { type PaginationParams } from '@src/factories/PaginationFactory'
import { type FragranceTraitRow } from '@src/services/repositories/FragranceTraitsRepo'
import { type FragranceAccordRow } from '@src/services/repositories/FragranceAccordsRepo'
import { type FragranceNoteRow } from '@src/services/repositories/FragranceNotesRepo'
import { type NoteLayerEnum } from '@src/db/schema'
import { type FragranceReviewDistRow, type FragranceReviewRow } from '@src/services/repositories/FragranceReviewsRepo'
import { ApiError } from '@src/common/error'

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
  myReview: DataLoader<FragranceLoaderKey, FragranceReviewRow | null>
}

export interface GetImagesLoaderParams {
  pagination: PaginationParams<string>
}

export interface GetAccordsLoaderParams {
  pagination: PaginationParams<string>
}

export interface GetNotesLoaderParams {
  layer: NoteLayerEnum
  pagination: PaginationParams<string>
}

export interface GetReviewsLoaderParams {
  pagination: PaginationParams<string>
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
    const key = this.generateKey('fAccords', params)
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

  getFillerNotesLoader (params: GetNotesLoaderParams): FragranceLoaders['notes'] {
    const key = this.generateKey('fNotes', params)
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
          error => { throw error }
        )
    })
  }

  private createImagesLoader (params: GetImagesLoaderParams): FragranceLoaders['images'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceImageRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .services
        .fragrance
        .images
        .find(
          eb => eb('fragranceImages.fragranceId', 'in', fragranceIds),
          { pagination }
        )
        .match(
          rows => {
            const imagesMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => imagesMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createTraitsLoader (): FragranceLoaders['traits'] {
    return new DataLoader<FragranceLoaderKey, FragranceTraitRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .services
        .fragrance
        .traits
        .find(eb => eb('fragranceTraits.fragranceId', 'in', fragranceIds))
        .match(
          rows => {
            const traitsMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => traitsMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createAccordsLoader (params: GetAccordsLoaderParams): FragranceLoaders['accords'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceAccordRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .services
        .fragrance
        .accords
        .find(
          eb => eb('fragranceAccords.fragranceId', 'in', fragranceIds),
          { pagination }
        )
        .match(
          rows => {
            const accordsMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => accordsMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createFillerAccordsLoader (params: GetAccordsLoaderParams): FragranceLoaders['fillerAccords'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceAccordRow[]>(async (keys) => {
      return await this
        .services
        .fragrance
        .accords
        .fillers
        .find(undefined, { pagination })
        .match(
          rows => keys.map(() => rows),
          error => { throw error }
        )
    })
  }

  private createNotesLoader (params: GetNotesLoaderParams): FragranceLoaders['notes'] {
    const { layer, pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceNoteRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .services
        .fragrance
        .notes
        .find(
          eb => eb.and([
            eb('fragranceNotes.fragranceId', 'in', fragranceIds),
            eb('fragranceNotes.layer', '=', layer)
          ]),
          { pagination }
        )
        .match(
          rows => {
            const notesMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => notesMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createFillerNotesLoader (params: GetNotesLoaderParams): FragranceLoaders['fillerNotes'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceNoteRow[]>(async (keys) => {
      return await this
        .services
        .fragrance
        .notes
        .fillers
        .find(undefined, { pagination })
        .match(
          rows => keys.map(() => rows),
          error => { throw error }
        )
    })
  }

  private createReviewsLoader (params: GetReviewsLoaderParams): FragranceLoaders['reviews'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceReviewRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .services
        .fragrance
        .reviews
        .find(
          eb => eb('fragranceReviews.fragranceId', 'in', fragranceIds),
          { pagination }
        )
        .match(
          rows => {
            const reviewsMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => reviewsMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createReviewDistributionsLoader (): FragranceLoaders['reviewDistributions'] {
    return new DataLoader<FragranceLoaderKey, FragranceReviewDistRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .services
        .fragrance
        .reviews
        .dist
        .find(eb => eb('fragranceReviews.fragranceId', 'in', fragranceIds))
        .match(
          rows => {
            const distMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => distMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createMyReviewsLoader (): FragranceLoaders['myReview'] {
    return new DataLoader<FragranceLoaderKey, FragranceReviewRow | null>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      const myId = this.services.fragrance.context.me?.id ?? null

      return await this
        .services
        .fragrance
        .reviews
        .find(
          eb => eb.and([
            eb('fragranceReviews.userId', '=', myId),
            eb('fragranceReviews.fragranceId', 'in', fragranceIds)
          ])
        )
        .match(
          rows => {
            const reviewsMap = new Map<number, FragranceReviewRow>()
            rows.forEach(row => {
              reviewsMap.set(row.fragranceId, row)
            })

            return fragranceIds.map(id => reviewsMap.get(id) ?? null)
          },
          error => { throw error }
        )
    })
  }

  private getFragranceIds (keys: readonly FragranceLoaderKey[]): Array<FragranceLoaderKey['fragranceId']> {
    return keys.map(({ fragranceId }) => fragranceId)
  }
}
