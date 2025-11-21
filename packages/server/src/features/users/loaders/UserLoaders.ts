import { BaseLoader } from '@src/loaders/BaseLoader.js'
import { UserImageLoaders } from './UserImageLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import { ResultAsync } from 'neverthrow'
import { BackendError, type UserRow, unwrapOrThrow } from '@aromi/shared'
import DataLoader from 'dataloader'
import type { UserRelationshipLoaderResult } from '../types.js'

export class UserLoaders extends BaseLoader {
  images: UserImageLoaders

  constructor (services: ServerServices) {
    super(services)
    this.images = new UserImageLoaders(services)
  }

  load (id: string) {
    return ResultAsync
      .fromPromise(
        this.getUserLoader().load(id),
        error => BackendError.fromLoader(error)
      )
  }

  loadFollowerCount (userId: string) {
    return ResultAsync
      .fromPromise(
        this.getFollowerCountLoader().load(userId),
        error => BackendError.fromLoader(error)
      )
  }

  loadFollowingCount (userId: string) {
    return ResultAsync
      .fromPromise(
        this.getFollowingCountLoader().load(userId),
        error => BackendError.fromLoader(error)
      )
  }

  loadRelationship (userId: string, targetUserId: string) {
    return ResultAsync
      .fromPromise(
        this.getRelationshipLoader(userId).load(targetUserId),
        error => BackendError.fromLoader(error)
      )
  }

  private getUserLoader () {
    const key = this.genKey('user')
    return this
      .getLoader(
        key,
        () => this.createUserLoader()
      )
  }

  private getFollowerCountLoader () {
    const key = this.genKey('followerCount')
    return this
      .getLoader(
        key,
        () => this.createFollowerCountLoader()
      )
  }

  private getFollowingCountLoader () {
    const key = this.genKey('followingCount')
    return this
      .getLoader(
        key,
        () => this.createFollowingCountLoader()
      )
  }

  private getRelationshipLoader (userId: string) {
    const key = this.genKey(`relationship:${userId}`)
    return this
      .getLoader(
        key,
        () => this.createRelationshipLoader(userId)
      )
  }

  private createUserLoader () {
    const { users } = this.services

    return new DataLoader<string, UserRow | null>(
      async keys => {
        const rows = await unwrapOrThrow(
          users
            .findDistinct(
              eb => eb('id', 'in', keys),
              'id'
            )
        )

        const map = new Map(rows.map(row => [row.id, row]))

        return keys.map(key => map.get(key) ?? null)
      }
    )
  }

  private createFollowerCountLoader () {
    const { users } = this.services

    return new DataLoader<string, number>(
      async keys => {
        const result = await unwrapOrThrow(
          users.follows.countFollowers(keys as string[])
        )

        const map = new Map(result.map(({ followedId, count }) => [followedId, count]))

        return keys.map(key => map.get(key) ?? 0)
      }
    )
  }

  private createFollowingCountLoader () {
    const { users } = this.services

    return new DataLoader<string, number>(
      async keys => {
        const result = await unwrapOrThrow(
          users.follows.countFollowing(keys as string[])
        )

        const map = new Map(result.map(({ followerId, count }) => [followerId, count]))

        return keys.map(key => map.get(key) ?? 0)
      }
    )
  }

  private createRelationshipLoader (userId: string) {
    const { users } = this.services

    return new DataLoader<string, UserRelationshipLoaderResult>(
      async keys => {
        const result = await unwrapOrThrow(
          users.follows.getRelationships(userId, keys as string[])
        )

        const map = new Map<string, UserRelationshipLoaderResult>()

        for (const targetUserId of keys as string[]) {
          map.set(targetUserId, { isFollowing: false, isFollowedBy: false })
        }

        for (const row of result) {
          const entry = map.get(row.followerId === userId ? row.followedId : row.followerId)
          if (entry != null) {
            if (row.followerId === userId) {
              entry.isFollowing = true
            }
            if (row.followedId === userId) {
              entry.isFollowedBy = true

            }
          }
        }

        return keys.map(key => map.get(key)!)
      }
    )
  }
}