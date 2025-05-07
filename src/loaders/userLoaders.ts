import { type UserRow, type UserService } from '@src/services/userService'
import DataLoader from 'dataloader'

export interface UserIdKey { id: number }
export interface UserReviewIdKey { reviewId: number }
export interface UserCollectionIdKey { collectionId: number }

export interface UserLoadersCache {
  userById: DataLoader<UserIdKey, UserRow | null>
  userByReviewId: DataLoader<UserReviewIdKey, UserRow | null>
  userByCollectionId: DataLoader<UserCollectionIdKey, UserRow | null>
}

export class UserLoaders implements UserLoadersCache {
  private readonly cache: Partial<UserLoadersCache> = {}

  constructor (private readonly userService: UserService) {}

  get userById (): UserLoadersCache['userById'] {
    if (this.cache.userById == null) {
      this.cache.userById = this.createById()
    }

    return this.cache.userById
  }

  get userByReviewId (): UserLoadersCache['userByReviewId'] {
    if (this.cache.userByReviewId == null) {
      this.cache.userByReviewId = this.createByReviewId()
    }

    return this.cache.userByReviewId
  }

  get userByCollectionId (): UserLoadersCache['userByCollectionId'] {
    if (this.cache.userByCollectionId == null) {
      this.cache.userByCollectionId = this.createByCollectionId()
    }

    return this.cache.userByCollectionId
  }

  private createById (): UserLoadersCache['userById'] {
    return new DataLoader<UserIdKey, UserRow | null>(async (keys) => {
      const userIds = keys.map(({ id }) => id)

      return await this
        .userService
        .getByIds(userIds)
        .match(
          users => {
            const userMap = new Map(users.map(u => [u.id, u]))
            return userIds.map(id => userMap.get(id) ?? null)
          },
          error => { throw error }
        )
    })
  }

  private createByReviewId (): UserLoadersCache['userByReviewId'] {
    return new DataLoader<UserReviewIdKey, UserRow | null>(async (keys) => {
      const reviewIds = keys.map(({ reviewId }) => reviewId)

      return await this
        .userService
        .getByReviewIds(reviewIds)
        .match(
          users => {
            const usersMap = new Map(users.map(u => [u.reviewId, u]))
            return reviewIds.map(id => usersMap.get(id) ?? null)
          },
          error => { throw error }
        )
    })
  }

  private createByCollectionId (): UserLoadersCache['userByCollectionId'] {
    return new DataLoader<UserCollectionIdKey, UserRow | null>(async (keys) => {
      const collectionIds = keys.map(({ collectionId }) => collectionId)

      return await this
        .userService
        .getByCollectionIds(collectionIds)
        .match(
          users => {
            const usersMap = new Map(users.map(u => [u.collectionId, u]))

            return collectionIds.map(id => usersMap.get(id) ?? null)
          },
          error => { throw error }
        )
    })
  }
}
