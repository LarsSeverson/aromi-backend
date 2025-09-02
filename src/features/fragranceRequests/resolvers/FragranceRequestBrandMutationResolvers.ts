import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers'
import { throwError } from '@src/common/error'

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
