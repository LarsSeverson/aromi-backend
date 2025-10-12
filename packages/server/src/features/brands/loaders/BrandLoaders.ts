import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { BrandLoadersKey } from '../types.js'
import DataLoader from 'dataloader'
import { BackendError, type BrandImageRow, unwrapOrThrow, type BrandRow, type BrandScoreRow, type BrandVoteRow } from '@aromi/shared'
import { okAsync, ResultAsync } from 'neverthrow'
import { BrandImageLoaders } from './BrandImageLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'

export class BrandLoaders extends BaseLoader {
  images: BrandImageLoaders

  constructor (services: ServerServices) {
    super(services)
    this.images = new BrandImageLoaders(services)
  }

  load (id: BrandLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getBrandLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadAvatar (id: BrandLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getBrandAvatarLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadScore (id: BrandLoadersKey) {
    return ResultAsync
      .fromPromise(
        this.getScoreLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadUserVote (
    id: BrandLoadersKey,
    userId?: string
  ) {
    if (userId == null) return okAsync(null)
    return ResultAsync
      .fromPromise(
        this.getUserVoteLoader(userId).load(id),
        error => BackendError.fromLoader(error)
      )
  }

  private getBrandLoader () {
    const key = this.genKey('brand')
    return this
      .getLoader(
        key,
        () => this.createBrandLoader()
      )
  }

  private getBrandAvatarLoader () {
    const key = this.genKey('brand-avatar')
    return this
      .getLoader(
        key,
        () => this.createBrandAvatarLoader()
      )
  }

  private getScoreLoader () {
    const key = this.genKey('brand-score')
    return this
      .getLoader(
        key,
        () => this.createScoreLoader()
      )
  }

  private getUserVoteLoader (
    userId: string
  ) {
    const key = this.genKey('brand-user-vote', userId)
    return this
      .getLoader(
        key,
        () => this.createUserVoteLoader(userId)
      )
  }

  private createBrandLoader () {
    const { brands } = this.services

    return new DataLoader<BrandLoadersKey, BrandRow>(
      async keys => {
        const rows = await unwrapOrThrow(
          brands
            .find(
              eb => eb('id', 'in', keys)
            )
        )

        const rowsMap = new Map<string, BrandRow>()

        rows.forEach(row => {
          if (!rowsMap.has(row.id)) rowsMap.set(row.id, row)
        })

        return keys.map(id => {
          const row = rowsMap.get(id)

          if (row == null) {
            throw new BackendError(
              'NOT_FOUND',
              `Brand with ID "${id}" not found`,
              404
            )
          }

          return row
        })
      }
    )
  }

  private createBrandAvatarLoader () {
    const { brands } = this.services

    return new DataLoader<BrandLoadersKey, BrandImageRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          brands
            .images
            .findDistinct(
              eb => eb('brandId', 'in', keys),
              'brandId'
            )
        )

        const rowsMap = new Map<string, BrandImageRow>()

        rows.forEach(row => {
          if (!rowsMap.has(row.brandId)) rowsMap.set(row.brandId, row)
        })

        return keys.map(id => rowsMap.get(id) ?? null)
      }
    )
  }

  private createScoreLoader () {
    const { brands } = this.services

    return new DataLoader<BrandLoadersKey, BrandScoreRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          brands
            .scores
            .findDistinct(
              eb => eb('brandId', 'in', keys),
              'brandId'
            )
        )

        const rowsMap = new Map<string, BrandScoreRow>()

        rows.forEach(row => {
          rowsMap.set(row.brandId, row)
        })

        return keys.map(id => rowsMap.get(id) ?? null)
      }
    )
  }

  private createUserVoteLoader (userId: string) {
    const { brands } = this.services

    return new DataLoader<BrandLoadersKey, BrandVoteRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          brands
            .votes
            .findDistinct(
              eb => eb.and([
                eb('brandId', 'in', keys),
                eb('userId', '=', userId)
              ]),
              'brandId'
            )
        )

        const rowsMap = new Map<string, BrandVoteRow>()

        rows.forEach(row => {
          rowsMap.set(row.brandId, row)
        })

        return keys.map(id => rowsMap.get(id) ?? null)
      }
    )
  }
}