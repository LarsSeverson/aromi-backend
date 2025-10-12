import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { BrandImageLoadersKey } from '../types.js'
import { ResultAsync } from 'neverthrow'
import DataLoader from 'dataloader'
import { BackendError, type BrandImageRow, unwrapOrThrow } from '@aromi/shared'

export class BrandImageLoaders extends BaseLoader {
  load (id: BrandImageLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getImageLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  private getImageLoader () {
    const key = this.genKey('asset')
    return this
      .getLoader(
        key,
        () => this.createLoader()
      )
  }

  private createLoader () {
    const { brands } = this.services

    return new DataLoader<BrandImageLoadersKey, BrandImageRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          brands
            .images
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