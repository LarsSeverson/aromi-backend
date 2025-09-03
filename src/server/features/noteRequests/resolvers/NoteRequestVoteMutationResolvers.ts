import { throwError } from '@src/common/error'
import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/server/resolvers/BaseResolver'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers'

export class NoteRequestVoteMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnNoteRequest: MutationResolvers['voteOnNoteRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, vote } = input
    const { noteRequests } = services

    return await noteRequests
      .withTransaction(() => noteRequests
        .findOne(
          eb => eb.and([
            eb('id', '=', requestId),
            eb('requestStatus', '=', 'PENDING')
          ])
        )
        .andThrough(() => noteRequests
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
        mapNoteRequestRowToNoteRequestSummary,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnNoteRequest: this.voteOnNoteRequest
    }
  }
}
