import { unwrapOrThrow } from '@aromi/shared'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'
import type { BrandEditResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class BrandEditFieldResolvers extends BaseResolver<BrandEditResolvers> {
  brand: BrandEditResolvers['brand'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { brandId } = parent
    const { services } = context

    const { brands } = services

    const row = await unwrapOrThrow(
      brands.findOne(eb => eb('id', '=', brandId))
    )

    return row
  }

  user: BrandEditResolvers['user'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { userId } = parent
    const { services } = context

    const { users } = services

    const row = await unwrapOrThrow(
      users.findOne(eb => eb('id', '=', userId))
    )

    return mapUserRowToUserSummary(row)
  }

  reviewer: BrandEditResolvers['reviewer'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { reviewedBy } = parent
    const { services } = context

    if (reviewedBy == null) return null

    const { users } = services

    const row = await unwrapOrThrow(
      users.findOne(eb => eb('id', '=', reviewedBy))
    )

    return mapUserRowToUserSummary(row)
  }

  getResolvers (): BrandEditResolvers {
    return {
      brand: this.brand,
      user: this.user,
      reviewer: this.reviewer
    }
  }
}