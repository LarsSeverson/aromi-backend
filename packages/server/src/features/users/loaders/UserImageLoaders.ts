import { BaseLoader } from '@src/loaders/BaseLoader.js'
import { ResultAsync } from 'neverthrow'
import { BackendError, unwrapOrThrow, type UserImageRow } from '@aromi/shared'
import DataLoader from 'dataloader'

export class UserImageLoaders extends BaseLoader {
  load (id: string) {
    return ResultAsync.fromPromise(
      this.getImageLoader().load(id),
      (error) => BackendError.fromLoader(error)
    )
  }

  private getImageLoader () {
    const key = this.genKey('image')
    return this.getLoader(key, () => this.createLoader())
  }

  private createLoader () {
    const { users } = this.services

    return new DataLoader<string, UserImageRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          users.images.findDistinct(
            eb => eb('id', 'in', keys),
            'id'
          )
        )

        const map = new Map(rows.map((row) => [row.id, row]))

        return keys.map((key) => map.get(key) ?? null)
      })
  }
}