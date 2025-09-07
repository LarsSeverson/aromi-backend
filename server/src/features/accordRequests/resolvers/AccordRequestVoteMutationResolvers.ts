import { throwError } from '@aromi/shared/utils/error'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers'
import { type MutationResolvers } from '@src/graphql/gql-types'

export class AccordRequestVoteMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnAccordRequest: MutationResolvers['voteOnAccordRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, vote } = input
    const { accordRequests } = services

    return await accordRequests
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
        mapAccordRequestRowToAccordRequestSummary,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnAccordRequest: this.voteOnAccordRequest
    }
  }
}
