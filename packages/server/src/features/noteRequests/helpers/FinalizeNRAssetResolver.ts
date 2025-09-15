import type { NoteRequestRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers.js'
import { FinalizeRequestAssetResolver } from '@src/features/requests/helpers/FinalizeRequestAssetResolver.js'

type Mutation = MutationResolvers['finalizeNoteRequestImage']

export class FinalizeNRResolver extends FinalizeRequestAssetResolver<Mutation, NoteRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { noteRequests } = services

    super({
      ...params,
      service: noteRequests
    })
  }

  mapToOutput = mapNoteRequestRowToNoteRequestSummary
}