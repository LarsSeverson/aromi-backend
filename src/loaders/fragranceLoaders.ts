import { extractPaginationParams, type PaginationParams } from '@src/common/pagination'
import { type ApiContext } from '@src/context'
import { type FragranceReviewDistRow, type FragranceImageRow, type FragranceService, type FragranceReviewRow, type FragranceTraitRow, type FragranceAccordRow } from '@src/services/fragranceService'
import DataLoader from 'dataloader'

export interface FragranceLoaderKey { fragranceId: number }

export interface FragranceLoadersCache {
  traits: DataLoader<FragranceLoaderKey, FragranceTraitRow[]>
  images: DataLoader<FragranceLoaderKey, FragranceImageRow[]>
  accords: DataLoader<FragranceLoaderKey, FragranceAccordRow[]>
  reviews: DataLoader<FragranceLoaderKey, FragranceReviewRow[]>
  reviewDistributions: DataLoader<FragranceLoaderKey, FragranceReviewDistRow[]>
}

export class FragranceLoaders implements FragranceLoadersCache {
  private readonly cache: Partial<FragranceLoadersCache> = {}
  private paginationParams: PaginationParams = extractPaginationParams()
  private me?: ApiContext['me']
  private fill?: boolean

  constructor (private readonly fragranceService: FragranceService) {}

  withMe (me: ApiContext['me']): this {
    this.me = me
    return this
  }

  withPagination (paginationParams: PaginationParams): this {
    this.paginationParams = paginationParams
    return this
  }

  withFill (fill?: boolean): this {
    this.fill = fill
    return this
  }

  get traits (): FragranceLoadersCache['traits'] {
    if (this.cache.traits == null) {
      this.cache.traits = this.createTraitsLoader()
    }

    return this.cache.traits
  }

  get images (): FragranceLoadersCache['images'] {
    if (this.cache.images == null) {
      this.cache.images = this.createImagesLoader()
    }

    return this.cache.images
  }

  get accords (): FragranceLoadersCache['accords'] {
    if (this.cache.accords == null) {
      this.cache.accords = this.createAccordsLoader()
    }

    return this.cache.accords
  }

  get reviews (): FragranceLoadersCache['reviews'] {
    if (this.cache.reviews == null) {
      this.cache.reviews = this.createReviewsLoader()
    }

    return this.cache.reviews
  }

  get reviewDistributions (): FragranceLoadersCache['reviewDistributions'] {
    if (this.cache.reviewDistributions == null) {
      this.cache.reviewDistributions = this.createReviewDistributionsLoader()
    }

    return this.cache.reviewDistributions
  }

  private createTraitsLoader (): FragranceLoadersCache['traits'] {
    const me = this.me

    return new DataLoader<FragranceLoaderKey, FragranceTraitRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)

      return await this
        .fragranceService
        .withMe(me)
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

  private createImagesLoader (): FragranceLoadersCache['images'] {
    const paginationParams = this.paginationParams

    return new DataLoader<FragranceLoaderKey, FragranceImageRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)

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

  private createAccordsLoader (): FragranceLoadersCache['accords'] {
    const { me, paginationParams, fill } = this

    return new DataLoader<FragranceLoaderKey, FragranceAccordRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)

      return await this
        .fragranceService
        .withMe(me)
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

  private createReviewsLoader (): FragranceLoadersCache['reviews'] {
    const { me, paginationParams } = this

    return new DataLoader<FragranceLoaderKey, FragranceReviewRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)

      return await this
        .fragranceService
        .withMe(me)
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

  private createReviewDistributionsLoader (): FragranceLoadersCache['reviewDistributions'] {
    return new DataLoader<FragranceLoaderKey, FragranceReviewDistRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)

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
}
