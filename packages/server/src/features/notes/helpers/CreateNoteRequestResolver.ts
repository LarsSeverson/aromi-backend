import type { NoteRequestRow } from '@aromi/shared'
import { CreateRequestResolver } from '@src/features/requests/helpers/CreateRequestResolver.js'
import type { MutationCreateNoteRequestArgs, MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapNoteRequestRowToNoteRequestSummary, mapCreateNoteRequestInputToRow } from '../utils/mappers.js'

type Mutation = MutationResolvers['createNoteRequest']

export class CreateNoteRequestResolver extends CreateRequestResolver<Mutation, NoteRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { notes } = services

    super({
      ...params,
      service: notes.requests
    })
  }

  mapToOutput = mapNoteRequestRowToNoteRequestSummary

  mapToValues (args: Partial<MutationCreateNoteRequestArgs>) {
    const { input } = args
    return mapCreateNoteRequestInputToRow(input)
  }
}
