import DataLoader from 'dataloader'
import { LoaderFactory } from './loaderFactory'
import { type PaginationParams } from '@src/common/pagination'
import { type FragranceCollectionItemRow, type CollectionService } from '@src/services/collectionService'
import { type UserService, type UserRow } from '@src/services/userService'

export interface CollectionLoaderKey { collectionId: number }

interface CollectionLoaders {
  items: DataLoader<CollectionLoaderKey, FragranceCollectionItemRow[]>
  users: DataLoader<CollectionLoaderKey, UserRow | null>
}

export interface GetItemsLoaderParams {
  paginationParams: PaginationParams
}

export class CollectionLoaderFactory extends LoaderFactory<CollectionLoaderKey> {
  constructor (
    private readonly collectionService: CollectionService,
    private readonly userService: UserService
  ) {
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

  getUsersLoader (): CollectionLoaders['users'] {
    const key = this.generateKey('users')
    return this
      .getLoader(
        key,
        () => this.createUsersLoader()
      )
  }

  private createItemsLoader (params: GetItemsLoaderParams): CollectionLoaders['items'] {
    const { paginationParams } = params

    return new DataLoader<CollectionLoaderKey, FragranceCollectionItemRow[]>(async (keys) => {
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

  private createUsersLoader (): CollectionLoaders['users'] {
    return new DataLoader<CollectionLoaderKey, UserRow | null>(async (keys) => {
      const collectionIds = this.getCollectionIds(keys)

      const rows = await this
        .userService
        .build({})
        .innerJoin('fragranceCollections as fc', join =>
          join
            .onRef('fc.userId', '=', 'users.id')
            .on('fc.deletedAt', 'is', null)
        )
        .selectAll('users')
        .select('fc.id as collectionId')
        .where('fc.id', 'in', collectionIds)
        .execute()

      const usersMap = new Map<number, UserRow>()
      rows.forEach(row => {
        if (row.collectionId != null) usersMap.set(row.collectionId, row)
      })

      return collectionIds.map(id => usersMap.get(id) ?? null)
    })
  }

  private getCollectionIds (keys: readonly CollectionLoaderKey[]): number[] {
    return keys.map(({ collectionId }) => collectionId)
  }
}
