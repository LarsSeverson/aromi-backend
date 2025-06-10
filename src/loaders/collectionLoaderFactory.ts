import DataLoader from 'dataloader'
import { type FragranceCollectionItemRow } from '@src/services/repositories/FragranceCollectionRepo'
import { type PaginationParams } from '@src/factories/PaginationFactory'
import { LoaderFactory } from './LoaderFactory'

export interface CollectionLoaderKey { collectionId: number }

interface CollectionLoaders {
  items: DataLoader<CollectionLoaderKey, FragranceCollectionItemRow[]>
}

export interface GetItemsLoaderParams {
  pagination: PaginationParams<string>
}

export class CollectionLoaderFactory extends LoaderFactory<CollectionLoaderKey> {
  getItemsLoader (params: GetItemsLoaderParams): CollectionLoaders['items'] {
    const key = this.generateKey('items', params)
    return this
      .getLoader(
        key,
        () => this.createItemsLoader(params)
      )
  }

  private createItemsLoader (params: GetItemsLoaderParams): CollectionLoaders['items'] {
    const { pagination } = params

    return new DataLoader<CollectionLoaderKey, FragranceCollectionItemRow[]>(async (keys) => {
      const collectionIds = this.getCollectionIds(keys)

      return await this
        .services
        .fragrance
        .collections
        .items
        .find(
          eb => eb('fragranceCollectionItems.collectionId', 'in', collectionIds),
          { pagination }
        )
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
