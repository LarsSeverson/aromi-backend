import type { NoteRequestRow } from '@aromi/shared'
import { StageRequestAssetResolver } from '@src/features/requests/helpers/StageRequestAssetResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { StageNoteRequestImageSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['stageNoteRequestImage']

export class StageNRAssetResolver extends StageRequestAssetResolver<Mutation, NoteRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { noteRequests } = services

    super({
      ...params,
      service: noteRequests,
      entity: 'notes',
      schema: StageNoteRequestImageSchema
    })
  }
}