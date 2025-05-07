import { type FragranceRow, type FragranceService } from '@src/services/fragranceService'
import DataLoader from 'dataloader'

export interface FragranceIdKey { id: number }
export interface FragranceCollectionIdKey { collectionId: number }

export interface FragranceLoadersCache {
  byId: DataLoader<FragranceIdKey, FragranceRow | null>
  byCollectionId: DataLoader<FragranceCollectionIdKey, FragranceRow | null>
}

export class FragranceLoaders implements FragranceLoadersCache {
  private readonly cache: Partial<FragranceLoadersCache> = {}

  constructor (private readonly fragranceService: FragranceService) {}

  get byId (): FragranceLoadersCache['byId'] {
    if (this.cache.byId == null) {
      this.cache.byId = this.createById()
    }

    return this.cache.byId
  }

  get byCollectionId (): FragranceLoadersCache['byCollectionId'] {
    if (this.cache.byCollectionId == null) {
      this.cache.byCollectionId = this.createByCollectionId()
    }

    return this.cache.byCollectionId
  }

  private createById (): FragranceLoadersCache['byId'] {
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

  private createByCollectionId (): FragranceLoadersCache['byCollectionId'] {
    return new DataLoader<FragranceCollectionIdKey, FragranceRow | null>(async (keys) => {
      const collectionIds = keys.map(({ collectionId }) => collectionId)

      return await this
        .fragranceService
        .getByCollectionIds(collectionIds)
        .match(
          fragrances => {
            const fragranceMap = new Map(fragrances.map(f => [f.collectionId, f]))
            return collectionIds.map(id => fragranceMap.get(id) ?? null)
          },
          error => { throw error }
        )
    })
  }
}
