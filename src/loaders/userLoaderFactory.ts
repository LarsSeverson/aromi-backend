import { type UserRow } from '@src/services/UserService'
import DataLoader from 'dataloader'
import { ApiError } from '@src/common/error'
import { type FragranceCollectionRow } from '@src/services/repositories/FragranceCollectionRepo'
import { LoaderFactory } from './LoaderFactory'
import { type PaginationParams } from '@src/factories/PaginationFactory'
import { type FragranceReviewRow } from '@src/services/repositories/FragranceReviewsRepo'
import { type FragranceVoteRow } from '@src/services/repositories/FragranceVotesRepo'

export interface UserLoaderKey { userId: number }

interface UserLoaders {
  user: DataLoader<UserLoaderKey, UserRow>
  collections: DataLoader<UserLoaderKey, FragranceCollectionRow[]>
  reviews: DataLoader<UserLoaderKey, FragranceReviewRow[]>
  likes: DataLoader<UserLoaderKey, FragranceVoteRow[]>
}

export interface GetCollectionsLoaderParams {
  pagination: PaginationParams<string>
}

export interface GetReviewsLoaderParams {
  pagination: PaginationParams<string>
}

export interface GetFragranceVotesLoaderParams {
  pagination: PaginationParams<string>
}

export class UserLoaderFactory extends LoaderFactory<UserLoaderKey> {
  getUserLoader (): UserLoaders['user'] {
    const key = this.generateKey('user')
    return this
      .getLoader(
        key,
        () => this.createUserLoader()
      )
  }

  getCollectionsLoader (params: GetCollectionsLoaderParams): UserLoaders['collections'] {
    const key = this.generateKey('collections', params)
    return this
      .getLoader(
        key,
        () => this.createCollectionsLoader(params)
      )
  }

  getReviewsLoader (params: GetReviewsLoaderParams): UserLoaders['reviews'] {
    const key = this.generateKey('reviews', params)
    return this
      .getLoader(
        key,
        () => this.createReviewsLoader(params)
      )
  }

  getLikesLoader (params: GetFragranceVotesLoaderParams): UserLoaders['likes'] {
    const key = this.generateKey('fragranceVotes', params)
    return this
      .getLoader(
        key,
        () => this.createFragranceVotesLoader(params)
      )
  }

  private createUserLoader (): UserLoaders['user'] {
    return new DataLoader<UserLoaderKey, UserRow>(async (keys) => {
      const userIds = this.getUserIds(keys)

      return await this
        .services
        .user
        .find(eb => eb('users.id', 'in', userIds))
        .match(
          rows => {
            const usersMap = new Map(rows.map(row => [row.id, row]))
            return userIds.map(id => {
              const user = usersMap.get(id)
              if (user == null) {
                throw new ApiError(
                  'NOT_FOUND',
                  "We couldn't find this user",
                  404
                )
              }
              return user
            })
          },
          error => { throw error }
        )
    })
  }

  private createCollectionsLoader (params: GetCollectionsLoaderParams): UserLoaders['collections'] {
    const { pagination } = params

    return new DataLoader<UserLoaderKey, FragranceCollectionRow[]>(async (keys) => {
      const userIds = this.getUserIds(keys)

      return await this
        .services
        .user
        .collections
        .find(
          eb => eb('fragranceCollections.userId', 'in', userIds),
          { pagination }
        )
        .match(
          rows => {
            const collectionsMap = new Map(userIds.map(id => [id, rows.filter(row => row.userId === id)]))
            return userIds.map(id => collectionsMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createReviewsLoader (params: GetReviewsLoaderParams): UserLoaders['reviews'] {
    const { pagination } = params

    return new DataLoader<UserLoaderKey, FragranceReviewRow[]>(async (keys) => {
      const userIds = this.getUserIds(keys)

      return await this
        .services
        .user
        .reviews
        .find(
          eb => eb('fragranceReviews.userId', 'in', userIds),
          { pagination }
        )
        .match(
          rows => {
            const collectionsMap = new Map(userIds.map(id => [id, rows.filter(row => row.userId === id)]))
            return userIds.map(id => collectionsMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private createFragranceVotesLoader (params: GetFragranceVotesLoaderParams): UserLoaders['likes'] {
    const { pagination } = params

    return new DataLoader<UserLoaderKey, FragranceVoteRow[]>(async (keys) => {
      const userIds = this.getUserIds(keys)

      return await this
        .services
        .user
        .votes
        .find(
          eb => eb.and([
            eb('fragranceVotes.userId', 'in', userIds),
            eb('fragranceVotes.vote', '=', 1)
          ]),
          { pagination }
        )
        .match(
          rows => {
            const collectionsMap = new Map(userIds.map(id => [id, rows.filter(row => row.userId === id)]))
            return userIds.map(id => collectionsMap.get(id) ?? [])
          },
          error => { throw error }
        )
    })
  }

  private getUserIds (keys: readonly UserLoaderKey[]): Array<UserLoaderKey['userId']> {
    return keys.map(({ userId }) => userId)
  }
}
