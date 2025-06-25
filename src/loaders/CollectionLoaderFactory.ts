import DataLoader from 'dataloader'
import { type FragranceCollectionItemRow } from '@src/services/repositories/FragranceCollectionRepo'
import { type PaginationParams } from '@src/factories/PaginationFactory'
import { LoaderFactory } from './LoaderFactory'

export interface CollectionLoaderKey { collectionId: number }

interface CollectionLoaders {
  items: DataLoader<CollectionLoaderKey, FragranceCollectionItemRow[]>
  hasFragrance: DataLoader<CollectionLoaderKey, boolean>
}

export interface GetItemsLoaderParams {
  pagination: PaginationParams<string>
}

export interface HasFragranceLoaderParams {
  fragranceId: number
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

  getHasFragranceLoader (params: HasFragranceLoaderParams): CollectionLoaders['hasFragrance'] {
    const key = this.generateKey('hasFragrance', params)
    return this
      .getLoader(
        key,
        () => this.createHasFragranceLoader(params)
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

  private createHasFragranceLoader (params: HasFragranceLoaderParams): CollectionLoaders['hasFragrance'] {
    const { fragranceId } = params

    return new DataLoader<CollectionLoaderKey, boolean>(async keys => {
      const collectionIds = this.getCollectionIds(keys)

      return await this
        .services
        .fragrance
        .collections
        .items
        .find(
          eb => eb.and([
            eb('collectionId', 'in', collectionIds),
            eb('fragranceId', '=', fragranceId)
          ])
        )
        .match(
          rows => {
            const collectionSet = new Set(rows.map(row => row.collectionId))
            return collectionIds.map(id => collectionSet.has(id))
          },
          error => { throw error }
        )
    })
  }

  private getCollectionIds (keys: readonly CollectionLoaderKey[]): number[] {
    return keys.map(({ collectionId }) => collectionId)
  }
}
