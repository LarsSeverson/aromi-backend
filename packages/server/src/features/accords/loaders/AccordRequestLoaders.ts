import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { AccordRequestLoadersKey } from '../types.js'
import { type AccordRequestScoreRow, type AccordRequestVoteRow, BackendError, unwrapOrThrow } from '@aromi/shared'
import DataLoader from 'dataloader'
import { okAsync, ResultAsync } from 'neverthrow'

export class AccordRequestLoaders extends BaseLoader {
  loadScore (id: AccordRequestLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getScoreLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadUserVote (
    id: AccordRequestLoadersKey,
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
    const { accords } = this.services

    return new DataLoader<AccordRequestLoadersKey, AccordRequestScoreRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          accords
            .requests
            .scores
            .findDistinct(
              eb => eb('requestId', 'in', keys),
              'requestId'
            )
        )

        const rowMap = new Map(rows.map(r => [r.requestId, r]))

        return keys.map(k => rowMap.get(k) ?? null)
      }
    )
  }

  private createUserVoteLoader (userId: string) {
    const { accords } = this.services

    return new DataLoader<AccordRequestLoadersKey, AccordRequestVoteRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          accords
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

        const rowMap = new Map(rows.map(r => [r.requestId, r]))

        return keys.map(k => rowMap.get(k) ?? null)
      }
    )
  }
}
