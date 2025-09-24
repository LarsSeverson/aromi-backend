import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { AssetLoaderKey } from '../types.js'
import { ResultAsync } from 'neverthrow'
import { type AssetUploadRow, BackendError, unwrapOrThrow } from '@aromi/shared'
import DataLoader from 'dataloader'

export class AssetLoaders extends BaseLoader<AssetLoaderKey> {
  load (id: AssetLoaderKey) {
    return ResultAsync
      .fromPromise(
        this.getAssetLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  private getAssetLoader () {
    const key = this.genKey('asset')
    return this
      .getLoader(
        key,
        () => this.createLoader()
      )
  }

  private createLoader () {
    const { assets } = this.services

    return new DataLoader<AssetLoaderKey, AssetUploadRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          assets
            .uploads
            .findDistinct(
              eb => eb('id', 'in', keys),
              'id'
            )
        )

        const map = new Map(rows.map(row => [row.id, row]))

        return keys.map(key => map.get(key) ?? null)
      }
    )
  }
}