import DataLoader from 'dataloader'
import { type FragranceService, type FragranceImageRow, type FragranceTraitRow, type FragranceAccordRow, type FragranceReviewRow, type FragranceReviewDistRow, type FragranceNoteRow } from '@src/services/fragranceService'
import { type PaginationParams } from '@src/common/pagination'
import { LoaderFactory } from './loaderFactory'
import { type NoteLayerEnum } from '@src/db/schema'

export interface FragranceLoaderKey { fragranceId: number }

interface FragranceLoaders {
  traits: DataLoader<FragranceLoaderKey, FragranceTraitRow[]>
  images: DataLoader<FragranceLoaderKey, FragranceImageRow[]>
  accords: DataLoader<FragranceLoaderKey, FragranceAccordRow[]>
  notes: DataLoader<FragranceLoaderKey, FragranceNoteRow[]>
  reviews: DataLoader<FragranceLoaderKey, FragranceReviewRow[]>
  reviewDistributions: DataLoader<FragranceLoaderKey, FragranceReviewDistRow[]>
}

export interface GetImagesLoaderParams {
  paginationParams: PaginationParams
}

export interface GetAccordsLoaderParams {
  paginationParams: PaginationParams
  fill?: boolean
}

export interface GetNotesLoaderParams {
  layer: NoteLayerEnum
  paginationParams: PaginationParams
  fill?: boolean
}

export interface GetReviewsLoaderParams {
  paginationParams: PaginationParams
}

export class FragranceLoaderFactory extends LoaderFactory<FragranceLoaderKey> {
  constructor (private readonly fragranceService: FragranceService) {
    super()
  }

  getTraitsLoader (): FragranceLoaders['traits'] {
    const key = this.generateKey('traits')
    return this
      .getLoader(
        key,
        () => this.createTraitsLoader()
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

  getAccordsLoader (params: GetAccordsLoaderParams): FragranceLoaders['accords'] {
    const key = this.generateKey('accords', params)
    return this
      .getLoader(
        key,
        () => this.createAccordsLoader(params)
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

  private createTraitsLoader (): FragranceLoaders['traits'] {
    return new DataLoader<FragranceLoaderKey, FragranceTraitRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .fragranceService
        .getTraitsOnMultiple({ fragranceIds })
        .match(
          rows => {
            const traitsMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => traitsMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createImagesLoader (params: GetImagesLoaderParams): FragranceLoaders['images'] {
    const { paginationParams } = params

    return new DataLoader<FragranceLoaderKey, FragranceImageRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .fragranceService
        .getImagesOnMultiple({ fragranceIds, paginationParams })
        .match(
          rows => {
            const imagesMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => imagesMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createAccordsLoader (params: GetAccordsLoaderParams): FragranceLoaders['accords'] {
    const { paginationParams, fill } = params

    return new DataLoader<FragranceLoaderKey, FragranceAccordRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .fragranceService
        .getAccords({ fragranceIds, paginationParams, fill })
        .match(
          rows => {
            const accordsMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => accordsMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createNotesLoader (params: GetNotesLoaderParams): FragranceLoaders['notes'] {
    const { layer, paginationParams, fill } = params

    return new DataLoader<FragranceLoaderKey, FragranceNoteRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .fragranceService
        .getNotes({ fragranceIds, layer, paginationParams, fill })
        .match(
          rows => {
            const notesMap = new Map(fragranceIds.map(id => [id, rows.filter(rows => rows.fragranceId === id)]))
            return fragranceIds.map(id => notesMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createReviewsLoader (params: GetReviewsLoaderParams): FragranceLoaders['reviews'] {
    const { paginationParams } = params

    return new DataLoader<FragranceLoaderKey, FragranceReviewRow[]>(async (keys) => {
      const fragranceIds = this.getFragranceIds(keys)

      return await this
        .fragranceService
        .getReviewsOnMultiple({ fragranceIds, paginationParams })
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
        .getReviewDistributionsOnMultiple({ fragranceIds })
        .match(
          rows => {
            const distMap = new Map(
              fragranceIds
                .map(id => [id, rows.filter(row => row.fragranceId === id)])
            )

            return fragranceIds.map(id => distMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private getFragranceIds (keys: readonly FragranceLoaderKey[]): Array<FragranceLoaderKey['fragranceId']> {
    return keys.map(({ fragranceId }) => fragranceId)
  }
}
