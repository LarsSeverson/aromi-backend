import { BaseLoader } from '@src/loaders/BaseLoader.js'
import { UserImageLoaders } from './UserImageLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import { ResultAsync } from 'neverthrow'
import { BackendError, type UserRow, unwrapOrThrow } from '@aromi/shared'
import DataLoader from 'dataloader'

export class UserLoaders extends BaseLoader {
  images: UserImageLoaders

  constructor (services: ServerServices) {
    super(services)
    this.images = new UserImageLoaders(services)
  }

  load (id: string) {
    return ResultAsync
      .fromPromise(
        this.getUserLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  private getUserLoader () {
    const key = this.genKey('user')
    return this
      .getLoader(
        key,
        () => this.createUserLoader()
      )
  }

  private createUserLoader () {
    const { users } = this.services

    return new DataLoader<string, UserRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          users
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