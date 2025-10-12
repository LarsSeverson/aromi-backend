import { BackendError, unwrapOrThrow } from '@aromi/shared'
import type { FragranceCollectionItemResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRowToFragranceSummary } from '../utils/mappers.js'

export class FragranceCollectionItemFieldResolvers extends BaseResolver<FragranceCollectionItemResolvers> {
  fragrance: FragranceCollectionItemResolvers['fragrance'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { fragranceId } = parent
    const { loaders } = context

    const { fragrances } = loaders

    const row = await unwrapOrThrow(fragrances.load(fragranceId))

    if (row == null) {
      throw new BackendError(
        'FRAGRANCE_NOT_FOUND',
        `Fragrance with ID ${fragranceId} not found`,
        404
      )
    }

    return mapFragranceRowToFragranceSummary(row)
  }

  getResolvers (): FragranceCollectionItemResolvers {
    return {
      fragrance: this.fragrance
    }
  }
}