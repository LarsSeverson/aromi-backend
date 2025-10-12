import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { NoteRequestLoadersKey } from '../types.js'
import DataLoader from 'dataloader'
import { BackendError, type NoteRequestScoreRow, type NoteRequestVoteRow, unwrapOrThrow } from '@aromi/shared'
import { okAsync, ResultAsync } from 'neverthrow'

export class NoteRequestLoaders extends BaseLoader {
  loadScore (id: NoteRequestLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getScoreLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadUserVote (
    id: NoteRequestLoadersKey,
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
    const { notes } = this.services

    return new DataLoader<NoteRequestLoadersKey, NoteRequestScoreRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          notes
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
    const { notes } = this.services

    return new DataLoader<NoteRequestLoadersKey, NoteRequestVoteRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          notes
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
