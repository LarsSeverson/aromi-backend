import { throwError } from '@src/common/error'
import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers'

export class BrandRequestVoteMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnBrandRequest: MutationResolvers['voteOnBrandRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, vote } = input
    const { brandRequests } = services

    return await brandRequests
      .withTransaction(() => brandRequests
        .findOne(
          eb => eb.and([
            eb('id', '=', requestId),
            eb('requestStatus', '=', 'PENDING')
          ])
        )
        .andThrough(() => brandRequests
          .votes
          .upsert(
            { userId: me.id, requestId, vote },
            oc => oc
              .columns(['userId', 'requestId'])
              .doUpdateSet({ vote })
          )
        )
      )
      .match(
        mapBrandRequestRowToBrandRequestSummary,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnBrandRequest: this.voteOnBrandRequest
    }
  }
}
