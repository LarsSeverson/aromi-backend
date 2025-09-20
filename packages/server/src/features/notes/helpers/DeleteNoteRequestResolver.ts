import type { NoteRequestRow } from '@aromi/shared'
import { DeleteRequestResolver } from '@src/features/requests/helpers/DeleteRequestResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['deleteNoteRequest']

export class DeleteNoteRequestResolver extends DeleteRequestResolver<Mutation, NoteRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { notes } = services

    super({
      ...params,
      service: notes.requests
    })
  }

  mapToOutput = mapNoteRequestRowToNoteRequestSummary
}