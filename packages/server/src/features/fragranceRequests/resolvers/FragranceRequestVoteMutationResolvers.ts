import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { throwError } from '@aromi/shared'

export class FragranceRequestVoteMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnFragranceRequest: MutationResolvers['voteOnFragranceRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, vote } = input
    const { fragranceRequests } = services

    return await fragranceRequests
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
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnFragranceRequest: this.voteOnFragranceRequest
    }
  }
}
