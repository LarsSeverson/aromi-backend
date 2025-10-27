import { BackendError, type FragranceCollectionItemRow, type FragranceCollectionRow, unwrapOrThrow } from '@aromi/shared'
import { BaseLoader } from '@src/loaders/BaseLoader.js'
import DataLoader from 'dataloader'
import { ResultAsync } from 'neverthrow'

export class FragranceCollectionLoaders extends BaseLoader {
  load (id: string) {
    return ResultAsync
      .fromPromise(
        this.getCollectionLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadItems (id: string) {
    return ResultAsync
      .fromPromise(
        this.getItemsLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadPreviewItems (id: string) {
    return ResultAsync
      .fromPromise(
        this.getPreviewItemsLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadHasFragrance (id: string, fragranceId: string) {
    return ResultAsync
      .fromPromise(
        this.getHasFragranceLoader(fragranceId).load(id),
        error => BackendError.fromLoader(error)
      )
  }

  private getCollectionLoader () {
    const key = this.genKey('collection')
    return this
      .getLoader(
        key,
        () => this.createCollectionLoader()
      )
  }

  private getItemsLoader () {
    const key = this.genKey('items')
    return this
      .getLoader(
        key,
        () => this.createItemsLoader()
      )
  }

  private getPreviewItemsLoader () {
    const key = this.genKey('previewItems')
    return this
      .getLoader(
        key,
        () => this.createPreviewItemsLoader()
      )
  }

  private getHasFragranceLoader (fragranceId: string) {
    const key = this.genKey('hasFragrance-', fragranceId)
    return this
      .getLoader(
        key,
        () => this.createHasFragranceLoader(fragranceId)
      )
  }

  private createCollectionLoader () {
    const { collections } = this.services.users

    return new DataLoader<string, FragranceCollectionRow | null>(
      async ids => {
        const rows = await unwrapOrThrow(
          collections.find(
            where => where('id', 'in', ids)
          )
        )

        const rowsMap = new Map<string, FragranceCollectionRow>()
        rows.forEach(row => {
          rowsMap.set(row.id, row)
        })

        return ids.map(id => rowsMap.get(id) ?? null)
      }
    )
  }

  private createItemsLoader () {
    const { collections } = this.services.users

    return new DataLoader<string, FragranceCollectionItemRow[]>(
      async ids => {
        const rows = await unwrapOrThrow(
          collections.items.find(
            where => where('collectionId', 'in', ids),
            qb => qb.orderBy('rank', 'desc')
          )
        )

        const rowsMap = new Map<string, FragranceCollectionItemRow[]>()

        rows.forEach(row => {
          const arr = rowsMap.get(row.collectionId) ?? []
          arr.push(row)
          rowsMap.set(row.collectionId, arr)
        })

        return ids.map(id => rowsMap.get(id) ?? [])
      }
    )
  }

  private createPreviewItemsLoader () {
    const { collections } = this.services.users

    return new DataLoader<string, FragranceCollectionItemRow[]>(
      async ids => {
        const rows = await unwrapOrThrow(
          collections.findPreviewItems(
            where => where('fragranceCollections.id', 'in', ids)
          )
        )

        const rowsMap = new Map<string, FragranceCollectionItemRow[]>()

        rows.forEach(row => {
          const arr = rowsMap.get(row.collectionId) ?? []
          arr.push(row)
          rowsMap.set(row.collectionId, arr)
        })

        return ids.map(id => rowsMap.get(id) ?? [])
      }
    )
  }

  private createHasFragranceLoader (fragranceId: string) {
    const { collections } = this.services.users

    return new DataLoader<string, boolean>(
      async ids => {
        const rows = await unwrapOrThrow(
          collections.hasFragranceInCollections(
            ids as string[],
            fragranceId
          )
        )

        const found = new Set<string>(rows.map(r => r.collectionId))
        return ids.map(id => found.has(id))
      }
    )
  }
}