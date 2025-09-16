import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { BrandLoadersKey } from '../types.js'
import DataLoader from 'dataloader'
import { BackendError, unwrapOrThrow, type BrandRow } from '@aromi/shared'
import { ResultAsync } from 'neverthrow'

export class BrandLoaders extends BaseLoader<BrandLoadersKey> {
  load (id: BrandLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getBrandLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  private getBrandLoader () {
    const key = this.genKey('brand')
    return this
      .getLoader(
        key,
        () => this.createBrandLoader()
      )
  }

  private createBrandLoader () {
    const { brands } = this.services

    return new DataLoader<BrandLoadersKey, BrandRow>(
      async keys => {
        const rows = await unwrapOrThrow(
          brands
            .find(
              eb => eb('id', 'in', keys)
            )
        )

        const rowsMap = new Map<string, BrandRow>()

        rows.forEach(row => {
          if (!rowsMap.has(row.id)) rowsMap.set(row.id, row)
        })

        return keys.map(id => {
          const row = rowsMap.get(id)

          if (row == null) {
            throw new BackendError(
              'NOT_FOUND',
              `Brand with ID "${id}" not found`,
              404
            )
          }

          return row
        })
      }
    )
  }
}