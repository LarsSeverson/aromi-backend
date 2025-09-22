import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { BrandRequestLoadersKey } from '../types.js'
import { BackendError, type BrandRequestScoreRow, type BrandRequestVoteRow, unwrapOrThrow } from '@aromi/shared'
import DataLoader from 'dataloader'
import { okAsync, ResultAsync } from 'neverthrow'

export class BrandRequestLoaders extends BaseLoader<BrandRequestLoadersKey> {
  loadScore (id: BrandRequestLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getScoreLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadUserVote (
    id: BrandRequestLoadersKey,
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
    const { brands } = this.services

    return new DataLoader<BrandRequestLoadersKey, BrandRequestScoreRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          brands
            .requests
            .scores
            .findDistinct(
              eb => eb('requestId', 'in', keys),
              'requestId'
            )
        )

        const rowMap = new Map<string, BrandRequestScoreRow>()

        rows.forEach(row => {
          rowMap.set(row.requestId, row)
        })

        return keys.map(id => rowMap.get(id) ?? null)
      }
    )
  }

  private createUserVoteLoader (userId: string) {
    const { brands } = this.services

    return new DataLoader<BrandRequestLoadersKey, BrandRequestVoteRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          brands
            .requests
            .votes
            .findDistinct(
              eb => eb.and([
                eb('requestId', 'in', keys),
                eb('userId', '=', userId)
              ]),
              'requestId'
            )
        )

        const rowMap = new Map<string, BrandRequestVoteRow>()

        rows.forEach(row => {
          rowMap.set(row.requestId, row)
        })

        return keys.map(id => rowMap.get(id) ?? null)
      }
    )
  }
}
