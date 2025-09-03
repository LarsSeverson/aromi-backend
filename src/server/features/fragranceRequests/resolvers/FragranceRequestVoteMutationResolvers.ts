import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/server/resolvers/BaseResolver'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers'
import { throwError } from '@src/common/error'

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
      .withTransaction(() => fragranceRequests
        .findOne(
          eb => eb.and([
            eb('id', '=', requestId),
            eb('requestStatus', '=', 'PENDING')
          ])
        )
        .andThrough(() => fragranceRequests
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
