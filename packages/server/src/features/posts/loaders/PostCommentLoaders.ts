import { BackendError, type PostCommentAssetRow, type PostCommentRow, type PostCommentScoreRow, type PostCommentVoteRow, unwrapOrThrow } from '@aromi/shared'
import { BaseLoader } from '@src/loaders/BaseLoader.js'
import DataLoader from 'dataloader'
import { okAsync, ResultAsync } from 'neverthrow'

export class PostCommentLoaders extends BaseLoader {
  load (id: string) {
    return ResultAsync.fromPromise(
      this.getPostCommentLoader().load(id),
      error => BackendError.fromLoader(error)
    )
  }

  loadAssets (commentId: string) {
    return ResultAsync.fromPromise(
      this.getPostCommentAssetsLoader().load(commentId),
      error => BackendError.fromLoader(error)
    )
  }

  loadScore (commentId: string) {
    return ResultAsync.fromPromise(
      this.getPostCommentScoreLoader().load(commentId),
      error => BackendError.fromLoader(error)
    )
  }

  loadUserVote (commentId: string, userId?: string) {
    if (userId == null) return okAsync(null)

    return ResultAsync.fromPromise(
      this.getUserVoteLoader(userId).load(commentId),
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

  private getPostCommentScoreLoader () {
    const key = this.genKey('score')
    return this.getLoader(
      key,
      () => this.createPostCommentScoreLoader()
    )
  }

  private getUserVoteLoader (userId: string) {
    const key = this.genKey(`userVote:${userId}`)
    return this.getLoader(
      key,
      () => this.createUserVoteLoader(userId)
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

  private createPostCommentScoreLoader () {
    const { posts } = this.services

    return new DataLoader<string, PostCommentScoreRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          posts.comments.scores.findDistinct(
            where => where('commentId', 'in', keys),
            'commentId'
          )
        )

        const rowMap = new Map(rows.map(row => [row.commentId, row]))

        return keys.map(key => rowMap.get(key) ?? null)
      }
    )
  }

  private createUserVoteLoader (userId: string) {
    const { posts } = this.services

    return new DataLoader<string, PostCommentVoteRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          posts.comments.votes.findDistinct(
            where => where
              .and([
                where('commentId', 'in', keys),
                where('userId', '=', userId)
              ]),
            'commentId'
          )
        )

        const rowMap = new Map(rows.map(row => [row.commentId, row]))

        return keys.map(key => rowMap.get(key) ?? null)
      }
    )
  }
}