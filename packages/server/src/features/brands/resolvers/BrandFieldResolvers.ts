import { unwrapOrThrow } from '@aromi/shared'
import { FragrancePaginationFactory } from '@src/features/fragrances/factories/FragrancePaginationFactory.js'
import { mapFragranceRowToFragranceSummary } from '@src/features/fragrances/utils/mappers.js'
import type { BrandResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class BrandFieldResolvers extends BaseResolver<BrandResolvers> {
  private readonly fragrancePagination = new FragrancePaginationFactory()

  avatar: BrandResolvers['avatar'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { loaders } = context

    const image = await unwrapOrThrow(
      loaders.brands.loadAvatar(id)
    )

    return image
  }

  fragrances: BrandResolvers['fragrances'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const pagination = this.fragrancePagination.parse(input)
    const { fragrances } = services

    const rows = await unwrapOrThrow(
      fragrances
        .find(
          eb => eb('brandId', '=', id),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(rows, pagination)
    const transformed = this.pageFactory.transform(connection, mapFragranceRowToFragranceSummary)

    return transformed
  }

  votes: BrandResolvers['votes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { me, loaders } = context

    const { brands } = loaders

    const score = await unwrapOrThrow(brands.loadScore(id))
    const myVoteRow = await unwrapOrThrow(brands.loadUserVote(id, me?.id))

    const votes = {
      upvotes: score?.upvotes ?? 0,
      downvotes: score?.downvotes ?? 0,
      score: score?.score ?? 0,
      myVote: myVoteRow?.vote
    }

    return votes
  }

  getResolvers (): BrandResolvers {
    return {
      avatar: this.avatar,
      fragrances: this.fragrances,
      votes: this.votes
    }
  }
}