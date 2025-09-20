import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { INoteRequestSummary } from '../types.js'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers.js'
import { VoteOnRequestResolver } from '@src/features/requests/helpers/VoteOnRequestResolver.js'
import { PROMOTION_JOB_NAMES, type NoteRequestRow } from '@aromi/shared'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'

type Mutation = MutationResolvers['voteOnNoteRequest']

export class VoteOnNoteRequestResolver extends VoteOnRequestResolver<Mutation, NoteRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { notes } = services

    super({
      ...params,
      service: notes.requests,
      jobName: PROMOTION_JOB_NAMES.PROMOTE_NOTE
    })
  }
  mapToOutput (request: NoteRequestRow): INoteRequestSummary {
    return mapNoteRequestRowToNoteRequestSummary(request)
  }
}