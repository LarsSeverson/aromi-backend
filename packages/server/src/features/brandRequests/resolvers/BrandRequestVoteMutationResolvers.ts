import { throwError } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'

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
      .withTransaction(trxService => trxService
        .findOne(
          eb => eb.and([
            eb('id', '=', requestId),
            eb('requestStatus', '=', 'PENDING')
          ])
        )
        .andThrough(() => trxService
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
