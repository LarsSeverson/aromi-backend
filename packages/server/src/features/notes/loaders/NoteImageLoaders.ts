import { BaseLoader } from '@src/loaders/BaseLoader.js'
import { ResultAsync } from 'neverthrow'
import { BackendError, type NoteImageRow, unwrapOrThrow } from '@aromi/shared'
import DataLoader from 'dataloader'
import type { NoteImageLoadersKey } from '../types.js'

export class NoteImageLoaders extends BaseLoader {
  load (id: NoteImageLoadersKey) {
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
    const { notes } = this.services

    return new DataLoader<NoteImageLoadersKey, NoteImageRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          notes
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