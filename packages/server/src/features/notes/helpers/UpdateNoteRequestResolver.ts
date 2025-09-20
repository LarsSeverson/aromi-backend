import type { NoteRequestRow } from '@aromi/shared'
import { UpdateRequestResolver } from '@src/features/requests/helpers/UpdateRequestResolver.js'
import type { MutationResolvers, MutationUpdateNoteRequestArgs } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapNoteRequestRowToNoteRequestSummary, mapUpdateNoteRequestInputToRow } from '../utils/mappers.js'

type Mutation = MutationResolvers['updateNoteRequest']

export class UpdateNoteRequestResolver extends UpdateRequestResolver<Mutation, NoteRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { notes } = services

    super({
      ...params,
      service: notes.requests
    })
  }

  mapToOutput = mapNoteRequestRowToNoteRequestSummary

  mapToValues (args: MutationUpdateNoteRequestArgs) {
    const { input } = args
    return mapUpdateNoteRequestInputToRow(input)
  }
}