import type { NoteRequestRow } from '@aromi/shared'
import { StageRequestAssetResolver } from '@src/features/requests/helpers/StageRequestAssetResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { StageNoteRequestThumbnailSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['stageNoteRequestThumbnail']

export class StageNoteRequestThumbnailResolver extends StageRequestAssetResolver<Mutation, NoteRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { notes } = services

    super({
      ...params,
      service: notes.requests,
      entity: 'notes',
      schema: StageNoteRequestThumbnailSchema
    })
  }
}