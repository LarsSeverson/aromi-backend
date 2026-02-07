import { BackendError, unwrapOrThrow } from '@aromi/shared'
import type { FragranceTraitResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRowToFragranceSummary } from '../utils/mappers.js'

export class FragranceTraitFieldResolvers extends BaseResolver<FragranceTraitResolvers> {
  fragrance: FragranceTraitResolvers['fragrance'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { loaders } = context

    const fragrance = await unwrapOrThrow(
      loaders.fragrances.load(parent.fragranceId)
    )

    if (fragrance == null) {
      throw new BackendError(
        'NOT_FOUND',
        'Fragrance not found for the given trait.',
        404
      )
    }

    return mapFragranceRowToFragranceSummary(fragrance)
  }

  options: FragranceTraitResolvers['options'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id, fragranceId } = parent
    const { loaders } = context

    const options = await unwrapOrThrow(
      loaders.fragrances.traits.loadOptions(parent.id)
    )

    const mapped = options.map(option => ({
      ...option,
      traitId: id,
      fragranceId
    }))

    return mapped
  }

  getResolvers () {
    return {
      fragrance: this.fragrance,
      options: this.options
    }
  }
}