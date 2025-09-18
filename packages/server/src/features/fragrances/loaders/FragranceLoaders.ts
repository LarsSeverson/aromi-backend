import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { FragranceLoadersKey } from '../types.js'
import DataLoader from 'dataloader'
import { BackendError, type AggFragranceTraitVoteRow, type CombinedTraitRow2, type FragranceImageRow, unwrapOrThrow, type FragranceTraitVoteRow, type FragranceAccordVoteRow, type FragranceNoteVoteRow } from '@aromi/shared'
import { ResultAsync } from 'neverthrow'

export class FragranceLoaders extends BaseLoader<FragranceLoadersKey> {
  loadImages (id: FragranceLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getImagesLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadTraits (id: FragranceLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getTraitsLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadTraitVotes (id: FragranceLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getTraitVotesLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadMyTraitVotes (
    id: FragranceLoadersKey,
    userId: string
  ) {
    return ResultAsync
      .fromPromise(
        this.getMyTraitVoteLoader(userId).load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadMyAccordVotes (
    id: FragranceLoadersKey,
    userId: string
  ) {
    return ResultAsync
      .fromPromise(
        this.getMyAccordVoteLoader(userId).load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadMyNoteVotes (
    id: FragranceLoadersKey,
    userId: string
  ) {
    return ResultAsync
      .fromPromise(
        this.getMyNoteVoteLoader(userId).load(id),
        error => BackendError.fromLoader(error)
      )
  }

  private getImagesLoader () {
    const key = this.genKey('images')
    return this
      .getLoader(
        key,
        () => this.createImagesLoader()
      )
  }

  private getTraitsLoader () {
    const key = this.genKey('traits')
    return this
      .getLoader(
        key,
        () => this.createTraitsLoader()
      )
  }

  private getTraitVotesLoader () {
    const key = this.genKey('traitVotes')
    return this
      .getLoader(
        key,
        () => this.createTraitVotesLoader()
      )
  }

  private getMyTraitVoteLoader (userId: string) {
    const key = this.genKey('myTraitVote', userId)
    return this
      .getLoader(
        key,
        () => this.createMyTraitVoteLoader(userId)
      )
  }

  private getMyAccordVoteLoader (userId: string) {
    const key = this.genKey('myAccordVote', userId)
    return this
      .getLoader(
        key,
        () => this.createMyAccordVotesLoader(userId)
      )
  }

  private getMyNoteVoteLoader (userId: string) {
    const key = this .genKey('myNoteVote', userId)
    return this
      .getLoader(
        key,
        () => this.createMyNoteVotesLoader(userId)
      )
  }

  private createImagesLoader () {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, FragranceImageRow[]>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .images
            .find(
              eb => eb('fragranceId', 'in', keys)
            )
        )

        const rowsMap = new Map<string, FragranceImageRow[]>()

        rows.forEach(row => {
          const arr = rowsMap.get(row.fragranceId) ?? []
          arr.push(row)
          rowsMap.set(row.fragranceId, arr)
        })

        return keys.map(id => rowsMap.get(id) ?? [])
      }
    )
  }

  private createTraitsLoader () {
    const { traits } = this.services

    return new DataLoader<FragranceLoadersKey, CombinedTraitRow2[]>(
      async keys => {
        const rows = await unwrapOrThrow(traits.types.findTraits())
        return keys.map(_ => rows)
      }
    )
  }

  private createTraitVotesLoader () {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, AggFragranceTraitVoteRow[]>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .traitVotes
            .findVotesAgg(
              eb => eb('fragranceId', 'in', keys)
            )
        )

        const rowsMap = new Map<string, AggFragranceTraitVoteRow[]>()

        rows.forEach(row => {
          const arr = rowsMap.get(row.fragranceId) ?? []
          arr.push(row)
          rowsMap.set(row.fragranceId, arr)
        })

        return keys.map(id => rowsMap.get(id) ?? [])
      }
    )
  }

  private createMyTraitVoteLoader (userId: string) {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, FragranceTraitVoteRow[]>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .traitVotes
            .find(
              eb => eb.and([
                eb('fragranceId', 'in', keys),
                eb('userId', '=', userId)
              ])
            )
        )

        const rowsMap = new Map<string, FragranceTraitVoteRow[]>()

        rows.forEach(row => {
          const arr = rowsMap.get(row.fragranceId) ?? []
          arr.push(row)
          rowsMap.set(row.fragranceId, arr)
        })

        return keys.map(id => rowsMap.get(id) ?? [])
      }
    )
  }

  private createMyAccordVotesLoader (userId: string) {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, FragranceAccordVoteRow[]>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .accords
            .votes
            .find(
              eb => eb.and([
                eb('fragranceId', 'in', keys),
                eb('userId', '=', userId)
              ])
            )
        )

        const rowsMap = new Map<string, FragranceAccordVoteRow[]>()

        rows.forEach(row => {
          const arr = rowsMap.get(row.fragranceId) ?? []
          arr.push(row)
          rowsMap.set(row.fragranceId, arr)
        })

        return keys.map(id => rowsMap.get(id) ?? [])
      }
    )
  }

  private createMyNoteVotesLoader (userId: string) {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, FragranceNoteVoteRow[]>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .notes
            .votes
            .find(
              eb => eb.and([
                eb('fragranceId', 'in', keys),
                eb('userId', '=', userId)
              ])
            )
        )

        const rowsMap = new Map<string, FragranceNoteVoteRow[]>()

        rows.forEach(row => {
          const arr = rowsMap.get(row.fragranceId) ?? []
          arr.push(row)
          rowsMap.set(row.fragranceId, arr)
        })

        return keys.map(id => rowsMap.get(id) ?? [])
      }
    )
  }
}