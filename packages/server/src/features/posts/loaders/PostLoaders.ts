import { BackendError, type PostAssetRow, type PostRow, unwrapOrThrow } from '@aromi/shared'
import { BaseLoader } from '@src/loaders/BaseLoader.js'
import DataLoader from 'dataloader'
import { ResultAsync } from 'neverthrow'
import { PostCommentLoaders } from './PostCommentLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'

export class PostLoaders extends BaseLoader {
  comments: PostCommentLoaders

  constructor (services: ServerServices) {
    super(services)
    this.comments = new PostCommentLoaders(services)
  }

  load (id: string) {
    return ResultAsync.fromPromise(
      this.getPostLoader().load(id),
      error => BackendError.fromLoader(error)
    )
  }

  loadAssets (postId: string) {
    return ResultAsync.fromPromise(
      this.getPostAssetsLoader().load(postId),
      error => BackendError.fromLoader(error)
    )
  }

  private getPostLoader () {
    const key = this.genKey('post')
    return this.getLoader(
      key,
      () => this.createPostLoader()
    )
  }

  private getPostAssetsLoader () {
    const key = this.genKey('assets')
    return this.getLoader(
      key,
      () => this.createPostAssetsLoader()
    )
  }

  private createPostLoader () {
    const { posts } = this.services

    return new DataLoader<string, PostRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          posts.findDistinct(
            where => where('id', 'in', keys),
            'id'
          )
        )

        const rowMap = new Map<string, PostRow>(rows.map(row => [row.id, row]))

        return keys.map(key => rowMap.get(key) ?? null)
      }
    )
  }

  private createPostAssetsLoader () {
    const { posts } = this.services

    return new DataLoader<string, PostAssetRow[]>(
      async keys => {
        const rows = await unwrapOrThrow(
          posts.assets.find(
            where => where('postId', 'in', keys),
            {
              extend: (qb) => qb
                .orderBy('postId', 'asc')
                .orderBy('displayOrder', 'asc')
            }
          )
        )

        const rowsMap = new Map<string, PostAssetRow[]>()

        rows.forEach(row => {
          const list = rowsMap.get(row.postId) ?? []
          list.push(row)
          rowsMap.set(row.postId, list)
        })

        return keys.map(key => rowsMap.get(key) ?? [])
      }
    )
  }
}