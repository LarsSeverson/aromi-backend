import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { FragranceLoadersKey } from '../types.js'
import DataLoader from 'dataloader'
import { BackendError, type AggFragranceTraitVoteRow, type CombinedTraitRow2, type FragranceImageRow, unwrapOrThrow, type FragranceTraitVoteRow, type FragranceAccordVoteRow, type FragranceNoteVoteRow, type FragranceScoreRow, type FragranceVoteRow, type FragranceRow } from '@aromi/shared'
import { okAsync, ResultAsync } from 'neverthrow'
import { FragranceCollectionLoaders } from './FragranceCollectionLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import { FragranceReviewLoaders } from './FragranceReviewLoaders.js'

export class FragranceLoaders extends BaseLoader {
  collections: FragranceCollectionLoaders
  reviews: FragranceReviewLoaders

  constructor (services: ServerServices) {
    super(services)
    this.collections = new FragranceCollectionLoaders(services)
    this.reviews = new FragranceReviewLoaders(services)
  }

  load (id: FragranceLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getFragranceLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadThumbnail (id: FragranceLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getThumbnailLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

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

  loadScore (id: FragranceLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getScoreLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadUserVote (
    id: FragranceLoadersKey,
    userId?: string
  ) {
    if (userId == null) return okAsync(null)

    return ResultAsync
      .fromPromise(
        this.getUserVoteLoader(userId).load(id),
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

  loadUserTraitVotes (
    id: FragranceLoadersKey,
    userId: string
  ) {
    return ResultAsync
      .fromPromise(
        this.getUserTraitVoteLoader(userId).load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadUserAccordVotes (
    id: FragranceLoadersKey,
    userId: string
  ) {
    return ResultAsync
      .fromPromise(
        this.getUserAccordVoteLoader(userId).load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadUserNoteVotes (
    id: FragranceLoadersKey,
    userId: string
  ) {
    return ResultAsync
      .fromPromise(
        this.getUserNoteVoteLoader(userId).load(id),
        error => BackendError.fromLoader(error)
      )
  }

  private getFragranceLoader () {
    const key = this.genKey('fragrance')
    return this
      .getLoader(
        key,
        () => this.createFragranceLoader()
      )
  }

  private getThumbnailLoader () {
    const key = this.genKey('thumbnail')
    return this
      .getLoader(
        key,
        () => this.createThumbnailLoader()
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

  private getScoreLoader () {
    const key = this.genKey('score')
    return this
      .getLoader(
        key,
        () => this.createScoreLoader()
      )
  }

  private getUserVoteLoader (userId: string) {
    const key = this.genKey('myVote', userId)
    return this
      .getLoader(
        key,
        () => this.createUserVoteLoader(userId)
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

  private getUserTraitVoteLoader (userId: string) {
    const key = this.genKey('myTraitVote', userId)
    return this
      .getLoader(
        key,
        () => this.createMyTraitVoteLoader(userId)
      )
  }

  private getUserAccordVoteLoader (userId: string) {
    const key = this.genKey('myAccordVote', userId)
    return this
      .getLoader(
        key,
        () => this.createMyAccordVotesLoader(userId)
      )
  }

  private getUserNoteVoteLoader (userId: string) {
    const key = this .genKey('myNoteVote', userId)
    return this
      .getLoader(
        key,
        () => this.createMyNoteVotesLoader(userId)
      )
  }

  private createFragranceLoader () {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, FragranceRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .findDistinct(
              eb => eb('id', 'in', keys),
              'id'
            )
        )

        const rowsMap = new Map<string, FragranceRow>()

        rows.forEach(row => {
          rowsMap.set(row.id, row)
        })

        return keys.map(id => rowsMap.get(id) ?? null)
      }
    )
  }

  private createThumbnailLoader () {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, FragranceImageRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .images
            .findDistinct(
              eb => eb('fragranceId', 'in', keys),
              'fragranceId'
            )
        )

        const rowsMap = new Map<string, FragranceImageRow>()

        rows.forEach(row => {
          rowsMap.set(row.fragranceId, row)
        })

        return keys.map(id => rowsMap.get(id) ?? null)
      }
    )
  }

  private createImagesLoader () {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, FragranceImageRow[]>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .images
            .find(eb => eb('fragranceId', 'in', keys))
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

  private createScoreLoader () {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, FragranceScoreRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .scores
            .findDistinct(
              eb => eb('fragranceId', 'in', keys),
              'fragranceId'
            )
        )

        const rowsMap = new Map<string, FragranceScoreRow>()

        rows.forEach(row => {
          rowsMap.set(row.fragranceId, row)
        })

        return keys.map(id => rowsMap.get(id) ?? null)
      }
    )
  }

  private createUserVoteLoader (userId: string) {
    const { fragrances } = this.services

    return new DataLoader<FragranceLoadersKey, FragranceVoteRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          fragrances
            .votes
            .findDistinct(
              eb => eb.and([
                eb('fragranceId', 'in', keys),
                eb('userId', '=', userId)
              ]),
              'fragranceId'
            )
        )

        const rowsMap = new Map<string, FragranceVoteRow>()

        rows.forEach(row => {
          rowsMap.set(row.fragranceId, row)
        })

        return keys.map(id => rowsMap.get(id) ?? null)
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