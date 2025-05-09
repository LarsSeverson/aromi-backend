import { type PaginationParams } from '@src/common/pagination'
import { type FragranceImageRow, type FragranceRow, type FragranceService } from '@src/services/fragranceService'
import DataLoader from 'dataloader'

export interface FragranceIdKey { id: number }
export interface FragranceCollectionIdKey { collectionId: number }
export interface FragranceImageKey {
  fragranceId: number
  paginationParams: PaginationParams
}

export interface FragranceLoadersCache {
  byId: DataLoader<FragranceIdKey, FragranceRow | null>
  byCollectionId: DataLoader<FragranceCollectionIdKey, FragranceRow | null>
  images: DataLoader<FragranceImageKey, FragranceImageRow[]>
}

export class FragranceLoaders implements FragranceLoadersCache {
  private readonly cache: Partial<FragranceLoadersCache> = {}

  constructor (private readonly fragranceService: FragranceService) {}

  get byId (): FragranceLoadersCache['byId'] {
    if (this.cache.byId == null) {
      this.cache.byId = this.createByIdLoader()
    }

    return this.cache.byId
  }

  get byCollectionId (): FragranceLoadersCache['byCollectionId'] {
    if (this.cache.byCollectionId == null) {
      this.cache.byCollectionId = this.createByCollectionIdLoader()
    }

    return this.cache.byCollectionId
  }

  get images (): FragranceLoadersCache['images'] {
    if (this.cache.images == null) {
      this.cache.images = this.createImagesLoader()
    }

    return this.cache.images
  }

  private createByIdLoader (): FragranceLoadersCache['byId'] {
    return new DataLoader<FragranceIdKey, FragranceRow | null>(async (keys) => {
      const fragranceIds = keys.map(({ id }) => id)

      return await this
        .fragranceService
        .getByIds(fragranceIds)
        .match(
          fragrances => {
            const fragranceMap = new Map(fragrances.map(f => [f.id, f]))
            return fragranceIds.map(id => fragranceMap.get(id) ?? null)
          },
          error => { throw error }
        )
    })
  }

  private createByCollectionIdLoader (): FragranceLoadersCache['byCollectionId'] {
    return new DataLoader<FragranceCollectionIdKey, FragranceRow | null>(async (keys) => {
      const collectionIds = keys.map(({ collectionId }) => collectionId)

      return await this
        .fragranceService
        .getByCollectionIds(collectionIds)
        .match(
          rows => {
            const fragranceMap = new Map(rows.map(r => [r.collectionId, r]))
            return collectionIds.map(id => fragranceMap.get(id) ?? null)
          },
          error => { throw error }
        )
    })
  }

  private createImagesLoader (): FragranceLoadersCache['images'] {
    return new DataLoader<FragranceImageKey, FragranceImageRow[]>(async (keys) => {
      const fragranceIds = keys.map(({ fragranceId }) => fragranceId)
      const paginationParams = keys[0].paginationParams

      return await this
        .fragranceService
        .getImagesByFragranceIds(fragranceIds, paginationParams)
        .match(
          rows => {
            const imagesMap = new Map(
              fragranceIds
                .map(id => [id, rows.filter(row => row.fragranceId === id)])
            )

            return fragranceIds.map(id => imagesMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }
}
