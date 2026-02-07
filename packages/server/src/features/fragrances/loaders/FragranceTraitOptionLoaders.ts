import { BackendError, type FragranceTraitScoreRow, type FragranceTraitVoteRow, unwrapOrThrow } from '@aromi/shared'
import { BaseLoader } from '@src/loaders/BaseLoader.js'
import DataLoader from 'dataloader'
import { okAsync, ResultAsync } from 'neverthrow'

interface LoadScoreParams {
  fragranceId: string
  optionId: string
}

interface LoadUserVoteParams {
  fragranceId: string
  optionId: string
  userId?: string | null
}

export class FragranceTraitOptionLoaders extends BaseLoader {
  loadScore (params: LoadScoreParams) {
    return ResultAsync
      .fromPromise(
        this.getScoreLoader(params.fragranceId).load(params.optionId),
        error => BackendError.fromLoader(error)
      )
  }

  loadUserVote (params: LoadUserVoteParams) {
    if (params.userId == null) return okAsync(null)

    return ResultAsync.fromPromise(
      this.getUserVoteLoader(params.fragranceId, params.userId).load(params.optionId),
      error => BackendError.fromLoader(error)
    )
  }

  private getScoreLoader (fragranceId: string) {
    const key = this.genKey('score', fragranceId)
    return this.getLoader(
      key,
      () => this.createScoreLoader(fragranceId)
    )
  }

  private getUserVoteLoader (fragranceId: string, userId: string) {
    const key = this.genKey('userVote', fragranceId, userId)
    return this.getLoader(
      key,
      () => this.createUserVoteLoader(fragranceId, userId)
    )
  }

  private createScoreLoader (fragranceId: string) {
    const { fragrances } = this.services

    return new DataLoader<string, FragranceTraitScoreRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances.traits.scores.find(
            where => where('fragranceId', '=', fragranceId).and('optionId', 'in', keys)
          )
        )

        const rowMap = new Map(rows.map(r => [r.optionId, r]))

        return keys.map(key => rowMap.get(key) ?? null)
      }
    )
  }

  private createUserVoteLoader (fragranceId: string, userId: string) {
    const { fragrances } = this.services

    return new DataLoader<string, FragranceTraitVoteRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances.traits.votes.find(
            where => where('fragranceId', '=', fragranceId)
              .and('userId', '=', userId)
              .and('traitOptionId', 'in', keys)
          )
        )

        const rowMap = new Map(rows.map(r => [r.traitOptionId, r]))

        return keys.map(key => rowMap.get(key) ?? null)
      }
    )
  }
}