import { type UserService, type UserRow } from '@src/services/userService'
import DataLoader from 'dataloader'
import { LoaderFactory } from './loaderFactory'
import { type ReviewService } from '@src/services/reviewService'
import { type FragranceService, type FragranceRow } from '@src/services/fragranceService'

export interface ReviewLoaderKey { reviewId: number }

interface ReviewLoaders {
  users: DataLoader<ReviewLoaderKey, UserRow | null>
  fragrances: DataLoader<ReviewLoaderKey, FragranceRow | null>
}

export class ReviewLoaderFactory extends LoaderFactory<ReviewLoaderKey> {
  constructor (
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
    private readonly fragranceService: FragranceService
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

  getFragrancesLoader (): ReviewLoaders['fragrances'] {
    const key = this.generateKey('fragrances')
    return this
      .getLoader(
        key,
        () => this.createFragrancesLoader()
      )
  }

  // Mono example
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

  // Micro example
  private createFragrancesLoader (): ReviewLoaders['fragrances'] {
    return new DataLoader<ReviewLoaderKey, FragranceRow | null>(async (keys) => {
      const reviewIds = this.getReviewIds(keys)

      const rows = await this
        .fragranceService
        .build()
        .innerJoin('fragranceReviews as fr', join =>
          join
            .onRef('fr.fragranceId', '=', 'fragrances.id')
            .on('fr.deletedAt', 'is', null)
        )
        .selectAll('fragrances')
        .select('fr.id as reviewId')
        .where('fr.id', 'in', reviewIds)
        .execute()

      const fragrancesMap = new Map<number, FragranceRow>()
      rows.forEach(row => {
        if (row.reviewId != null) fragrancesMap.set(row.reviewId, row)
      })

      return reviewIds.map(id => fragrancesMap.get(id) ?? null)
    })
  }

  private getReviewIds (keys: readonly ReviewLoaderKey[]): number[] {
    return keys.map(({ reviewId }) => reviewId)
  }
}
