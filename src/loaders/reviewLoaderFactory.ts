import { type UserService, type UserRow } from '@src/services/userService'
import DataLoader from 'dataloader'
import { LoaderFactory } from './loaderFactory'
import { type ReviewService } from '@src/services/reviewService'

export interface ReviewLoaderKey { reviewId: number }

interface ReviewLoaders {
  users: DataLoader<ReviewLoaderKey, UserRow | null>
}

export class ReviewLoaderFactory extends LoaderFactory<ReviewLoaderKey> {
  constructor (
    private readonly userService: UserService,
    private readonly reviewService: ReviewService
  ) {
    super()
  }

  getUsersLoader (): ReviewLoaders['users'] {
    const key = this.generateKey('users')
    return this
      .getLoader(
        key,
        () => this.createUsersLoader()
      )
  }

  private createUsersLoader (): ReviewLoaders['users'] {
    return new DataLoader<ReviewLoaderKey, UserRow | null>(async (keys) => {
      const reviewIds = this.getReviewIds(keys)

      const rows = await this
        .userService
        .build({})
        .innerJoin('fragranceReviews as fr', join =>
          join
            .onRef('fr.userId', '=', 'users.id')
            .on('fr.deletedAt', 'is', null)
        )
        .selectAll('users')
        .select('fr.id as reviewId')
        .where('fr.id', 'in', reviewIds)
        .execute()

      const usersMap = new Map<number, UserRow>()
      rows.forEach(row => {
        if (row.reviewId != null) usersMap.set(row.reviewId, row)
      })

      return reviewIds.map(id => usersMap.get(id) ?? null)
    })
  }

  private getReviewIds (keys: readonly ReviewLoaderKey[]): number[] {
    return keys.map(({ reviewId }) => reviewId)
  }
}
