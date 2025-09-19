import { unwrapOrThrow } from '@aromi/shared'
import type { FragranceEditResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRowToFragranceSummary } from '../utils/mappers.js'

export class FragranceEditFieldResolvers extends BaseResolver<FragranceEditResolvers> {
  fragrance: FragranceEditResolvers['fragrance'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { fragranceId } = parent
    const { services } = context

    const { fragrances } = services

    const row = await unwrapOrThrow(
      fragrances.findOne(eb => eb('id', '=', fragranceId))
    )

    return mapFragranceRowToFragranceSummary(row)
  }

  proposedBrand: FragranceEditResolvers['proposedBrand'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { proposedBrandId } = parent
    const { services } = context

    if (proposedBrandId == null) return null

    const { brands } = services

    const row = await unwrapOrThrow(
      brands.findOne(eb => eb('id', '=', proposedBrandId))
    )

    return row
  }

  proposedImage: FragranceEditResolvers['proposedImage'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { proposedImageId } = parent
    const { services } = context

    if (proposedImageId == null) return null

    const { assets } = services

    const row = await unwrapOrThrow(
      assets
        .uploads
        .findOne(eb => eb('id', '=', proposedImageId))
    )

    return row
  }

  user: FragranceEditResolvers['user'] = async (
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

    return row
  }

  reviewer: FragranceEditResolvers['reviewer'] = async (
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

    return row
  }

  getResolvers (): FragranceEditResolvers {
    return {
      fragrance: this.fragrance,
      proposedBrand: this.proposedBrand,
      proposedImage: this.proposedImage,
      user: this.user,
      reviewer: this.reviewer
    }
  }
}