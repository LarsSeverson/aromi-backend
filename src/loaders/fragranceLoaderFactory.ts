import DataLoader from 'dataloader'
import { LoaderFactory } from './loaderFactory'
import { type FragranceService } from '@src/services/FrragranceService'
import { type FragranceImageRow } from '@src/services/fragrance/FragranceImageRepo'
import { type PaginationParams } from '@src/factories/PaginationFactory'
import { type FragranceTraitRow } from '@src/services/fragrance/FragranceTraitsRepo'
import { type FragranceAccordRow } from '@src/services/fragrance/FragranceAccordsRepo'
import { type FragranceNoteRow } from '@src/services/fragrance/FragranceNotesRepo'
import { type NoteLayerEnum } from '@src/db/schema'
import { type FragranceReviewDistRow, type FragranceReviewRow } from '@src/services/fragrance/FragranceReviewsRepo'
// import { type FragranceService, type FragranceTraitRow, type FragranceAccordRow, type FragranceReviewDistRow, type FragranceNoteRow } from '@src/services/fragranceService'
// import { LoaderFactory } from './loaderFactory'
// import { type NoteLayerEnum } from '@src/db/schema'
// import { type ReviewService, type FragranceReviewRow } from '@src/services/reviewService'
// import { type VoteSortBy } from '@src/generated/gql-types'
// import { type FragranceImageRow } from '@src/services/fragrance/fragranceImageRepo'
// import { type PaginationOptions } from '@src/services/TableService'

export interface FragranceLoaderKey { fragranceId: number }

interface FragranceLoaders {
  images: DataLoader<FragranceLoaderKey, FragranceImageRow[]>
  traits: DataLoader<FragranceLoaderKey, FragranceTraitRow[]>
  accords: DataLoader<FragranceLoaderKey, FragranceAccordRow[]>
  fillerAccords: DataLoader<FragranceLoaderKey, FragranceAccordRow[]>
  notes: DataLoader<FragranceLoaderKey, FragranceNoteRow[]>
  fillerNotes: DataLoader<FragranceLoaderKey, FragranceNoteRow[]>
  reviews: DataLoader<FragranceLoaderKey, FragranceReviewRow[]>
  reviewDistributions: DataLoader<FragranceLoaderKey, FragranceReviewDistRow[]>
  myReviews: DataLoader<FragranceLoaderKey, FragranceReviewRow | null>
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
  constructor (
    private readonly fragranceService: FragranceService
  ) {
    super()
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

  getMyReviewsLoader (): FragranceLoaders['myReviews'] {
    const key = this.generateKey('myReview')
    return this
      .getLoader(
        key,
        () => this.createMyReviewsLoader()
      )
  }

  private createImagesLoader (params: GetImagesLoaderParams): FragranceLoaders['images'] {
    const { pagination } = params

    return new DataLoader<FragranceLoaderKey, FragranceImageRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .fragranceService
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
        .fragranceService
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
        .fragranceService
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
        .fragranceService
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
        .fragranceService
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
        .fragranceService
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
        .fragranceService
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
        .fragranceService
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

  private createMyReviewsLoader (): FragranceLoaders['myReviews'] {
    return new DataLoader<FragranceLoaderKey, FragranceReviewRow | null>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      const myId = this.fragranceService.context.me?.id ?? null

      return await this
        .fragranceService
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
