import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { throwError } from '@aromi/shared'

export class FragranceRequestBrandMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragranceRequestBrand: MutationResolvers['setFragranceRequestBrand'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, version, brandId } = input
    const { fragranceRequests } = services

    const values = {
      brandId,
      updatedAt: new Date().toISOString()
    }

    return await fragranceRequests
      .updateOne(
        eb => eb.and([
          eb('id', '=', requestId),
          eb('userId', '=', me.id),
          eb('version', '=', version),
          eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
        ]),
        eb => ({
          ...values,
          version: eb(eb.ref('version'), '+', 1)
        })
      )
      .match(
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceRequestBrand: this.setFragranceRequestBrand
    }
  }
}
