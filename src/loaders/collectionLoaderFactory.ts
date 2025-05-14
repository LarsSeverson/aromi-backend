import DataLoader from 'dataloader'
import { LoaderFactory } from './loaderFactory'
import { type PaginationParams } from '@src/common/pagination'
import { type CollectionItemRow, type CollectionService } from '@src/services/collectionService'

export interface CollectionLoaderKey { collectionId: number }

interface CollectionLoaders {
  items: DataLoader<CollectionLoaderKey, CollectionItemRow[]>
}

export interface GetItemsLoaderParams {
  paginationParams: PaginationParams
}

export class CollectionLoaderFactory extends LoaderFactory<CollectionLoaderKey> {
  constructor (private readonly collectionService: CollectionService) {
    super()
  }

  getItemsLoader (params: GetItemsLoaderParams): CollectionLoaders['items'] {
    const key = this.generateKey('items', params)
    return this
      .getLoader(
        key,
        () => this.createItemsLoader(params)
      )
  }

  private createItemsLoader (params: GetItemsLoaderParams): CollectionLoaders['items'] {
    const { paginationParams } = params

    return new DataLoader<CollectionLoaderKey, CollectionItemRow[]>(async (keys) => {
      const collectionIds = this.getCollectionIds(keys)

      return await this
        .collectionService
        .findAllItemsPaginated({ criteria: { id: collectionIds }, paginationParams })
        .match(
          rows => {
            const itemsMap = new Map(collectionIds.map(id => [id, rows.filter(row => row.collectionId === id)]))
            return collectionIds.map(id => itemsMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private getCollectionIds (keys: readonly CollectionLoaderKey[]): number[] {
    return keys.map(({ collectionId }) => collectionId)
  }
}
