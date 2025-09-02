import { throwError } from '@src/common/error'
import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers'

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
      .withTransaction(() => accordRequests
        .findOne(
          eb => eb.and([
            eb('id', '=', requestId),
            eb('requestStatus', '=', 'PENDING')
          ])
        )
        .andThrough(() => accordRequests
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
