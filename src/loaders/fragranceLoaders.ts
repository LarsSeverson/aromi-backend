import { extractPaginationParams, type PaginationParams } from '@src/common/pagination'
import { type FragranceReviewDistRow, type FragranceImageRow, type FragranceService, type FragranceReviewRow } from '@src/services/fragranceService'
import DataLoader from 'dataloader'

export interface FragranceKey { fragranceId: number }

export interface FragranceLoadersCache {
  images: DataLoader<FragranceKey, FragranceImageRow[]>
  reviews: DataLoader<FragranceKey, FragranceReviewRow[]>
  reviewDistributions: DataLoader<FragranceKey, FragranceReviewDistRow[]>
}

export class FragranceLoaders implements FragranceLoadersCache {
  private readonly cache: Partial<FragranceLoadersCache> = {}
  private paginationParams: PaginationParams = extractPaginationParams()

  constructor (private readonly fragranceService: FragranceService) {}

  withPagination (paginationParams: PaginationParams): this {
    this.paginationParams = paginationParams
    return this
  }

  get images (): FragranceLoadersCache['images'] {
    if (this.cache.images == null) {
      this.cache.images = this.createImagesLoader()
    }

    return this.cache.images
  }

  get reviews (): FragranceLoadersCache['reviews'] {
    if (this.cache.reviews == null) {
      this.cache.reviews = this.createReviewsLoaders()
    }

    return this.cache.reviews
  }

  get reviewDistributions (): FragranceLoadersCache['reviewDistributions'] {
    if (this.cache.reviewDistributions == null) {
      this.cache.reviewDistributions = this.createReviewDistributionsLoader()
    }

    return this.cache.reviewDistributions
  }

  private createImagesLoader (): FragranceLoadersCache['images'] {
    const paginationParams = this.paginationParams

    return new DataLoader<FragranceKey, FragranceImageRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)

      return await this
        .fragranceService
        .getImages({ fragranceIds, paginationParams })
        .match(
          rows => {
            const imagesMap = new Map(fragranceIds.map(id => [id, rows.filter(row => row.fragranceId === id)]))
            return fragranceIds.map(id => imagesMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createReviewsLoaders (): FragranceLoadersCache['reviews'] {
    const paginationParams = this.paginationParams

    return new DataLoader<FragranceKey, FragranceReviewRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)

      return await this
        .fragranceService
        .getReviews({ fragranceIds, paginationParams })
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
    return new DataLoader<FragranceKey, FragranceReviewDistRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)

      return await this
        .fragranceService
        .getReviewDistributions({ fragranceIds })
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
