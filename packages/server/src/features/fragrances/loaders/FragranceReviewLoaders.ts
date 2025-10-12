import { BaseLoader } from '@src/loaders/BaseLoader.js'
import { ResultAsync, okAsync } from 'neverthrow'
import DataLoader from 'dataloader'
import { BackendError, type FragranceReviewScoreRow, type FragranceReviewVoteRow, unwrapOrThrow } from '@aromi/shared'

export class FragranceReviewLoaders extends BaseLoader {
  loadScore (id: string) {
    return ResultAsync
      .fromPromise(
        this.getScoreLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadUserVote (
    id: string,
    userId?: string
  ) {
    if (userId == null) return okAsync(null)

    return ResultAsync
      .fromPromise(
        this.getUserVoteLoader(userId).load(id),
        error => BackendError.fromLoader(error)
      )
  }

  private getScoreLoader () {
    const key = this.genKey('score')
    return this
      .getLoader(
        key,
        () => this.createScoreLoader()
      )
  }

  private getUserVoteLoader (userId: string) {
    const key = this.genKey('userVote', userId)
    return this
      .getLoader(
        key,
        () => this.createUserVoteLoader(userId)
      )
  }

  private createScoreLoader () {
    const { fragrances } = this.services

    return new DataLoader<string, FragranceReviewScoreRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .reviews
            .scores
            .findDistinct(
              eb => eb('reviewId', 'in', keys),
              'reviewId'
            )
        )

        const rowMap = new Map(rows.map(row => [row.reviewId, row]))

        return keys.map(key => rowMap.get(key) ?? null)
      }
    )
  }

  private createUserVoteLoader (userId: string) {
    const { fragrances } = this.services

    return new DataLoader<string, FragranceReviewVoteRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .reviews
            .votes
            .findDistinct(
              eb => eb('reviewId', 'in', keys).and('userId', '=', userId),
              'reviewId'
            )
        )

        const rowMap = new Map(rows.map(row => [row.reviewId, row]))

        return keys.map(key => rowMap.get(key) ?? null)
      }
    )
  }
}