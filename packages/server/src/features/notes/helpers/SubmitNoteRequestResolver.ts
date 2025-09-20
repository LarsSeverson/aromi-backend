import { parseOrErr, ValidNote, type BackendError, type NoteRequestRow } from '@aromi/shared'
import { SubmitRequestResolver } from '@src/features/requests/helpers/SubmitRequestResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import type { Result } from 'neverthrow'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['submitNoteRequest']

export class SubmitNoteRequestResolver extends SubmitRequestResolver<Mutation, NoteRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { notes } = services

    super({
      ...params,
      service: notes.requests
    })
  }

  mapToOutput = mapNoteRequestRowToNoteRequestSummary

  validateRequest (
    request: NoteRequestRow
  ): Result<NoteRequestRow, BackendError> {
    return parseOrErr(ValidNote, request).map(() => request)
  }
}