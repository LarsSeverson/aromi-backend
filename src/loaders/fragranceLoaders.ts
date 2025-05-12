import { type ApiContext } from '@src/context'
import DataLoader from 'dataloader'
import { ApiLoader } from './loaders'
import { type FragranceService, type FragranceImageRow } from '@src/services/fragranceService'
import { type PaginationParams } from '@src/common/pagination'

export interface FragranceLoaderKey { fragranceId: number }

export interface FragranceLoadersCache {
  images: DataLoader<FragranceLoaderKey, FragranceImageRow[]>
}

export interface GetImagesLoaderParams {
  paginationParams: PaginationParams
}

export class FragranceLoaders extends ApiLoader {
  private readonly cache = new Map<string, FragranceLoadersCache[keyof FragranceLoadersCache]>()
  private me?: ApiContext['me']

  constructor (private readonly fragranceService: FragranceService) {
    super()
  }

  withMe (me: ApiContext['me']): this {
    this.me = me
    return this
  }

  getImagesLoader (params: GetImagesLoaderParams): FragranceLoadersCache['images'] {
    const key = this.generateKey('images', params)
    return this
      .getLoader(
        key,
        () => this.createImagesLoader(params)
      )
  }

  private getLoader<K extends keyof FragranceLoadersCache>(
    key: string,
    factory: () => FragranceLoadersCache[K]
  ): FragranceLoadersCache[K] {
    if (!this.cache.has(key)) {
      this.cache.set(key, factory())
    }

    return this.cache.get(key) as FragranceLoadersCache[K]
  }

  private createImagesLoader (params: GetImagesLoaderParams): FragranceLoadersCache['images'] {
    const { paginationParams } = params

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
}
