import { BackendError, type PostCommentAssetRow, type PostCommentRow, unwrapOrThrow } from '@aromi/shared'
import { BaseLoader } from '@src/loaders/BaseLoader.js'
import DataLoader from 'dataloader'
import { ResultAsync } from 'neverthrow'

export class PostCommentLoaders extends BaseLoader {
  load (id: string) {
    return ResultAsync.fromPromise(
      this.getPostCommentLoader().load(id),
      error => BackendError.fromLoader(error)
    )
  }

  loadAssets (postId: string) {
    return ResultAsync.fromPromise(
      this.getPostCommentAssetsLoader().load(postId),
      error => BackendError.fromLoader(error)
    )
  }

  private getPostCommentLoader () {
    const key = this.genKey('post')
    return this.getLoader(
      key,
      () => this.createPostCommentLoader()
    )
  }

  private getPostCommentAssetsLoader () {
    const key = this.genKey('assets')
    return this.getLoader(
      key,
      () => this.createPostCommentAssetsLoader()
    )
  }

  private createPostCommentLoader () {
    const { posts } = this.services

    return new DataLoader<string, PostCommentRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          posts.comments.findDistinct(
            where => where('id', 'in', keys),
            'id'
          )
        )

        const rowMap = new Map<string, PostCommentRow>(rows.map(row => [row.id, row]))

        return keys.map(key => rowMap.get(key) ?? null)
      }
    )
  }

  private createPostCommentAssetsLoader () {
    const { posts } = this.services

    return new DataLoader<string, PostCommentAssetRow[]>(
      async keys => {
        const rows = await unwrapOrThrow(
          posts.comments.assets.find(
            where => where('commentId', 'in', keys),
            {
              extend: (qb) => qb
                .orderBy('commentId', 'asc')
                .orderBy('displayOrder', 'asc')
            }
          )
        )

        const rowsMap = new Map<string, PostCommentAssetRow[]>()

        rows.forEach(row => {
          const list = rowsMap.get(row.commentId) ?? []
          list.push(row)
          rowsMap.set(row.commentId, list)
        })

        return keys.map(key => rowsMap.get(key) ?? [])
      }
    )
  }
}