import type { AccordRequestRow } from '@aromi/shared'
import { StageRequestAssetResolver } from '@src/features/requests/helpers/StageRequestAssetResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { StageAccordRequestThumbnailSchema } from '../utils/validation.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'

type Mutation = MutationResolvers['stageAccordRequestThumbnail']

export class StageAccordRequestThumbnailResolver extends StageRequestAssetResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accords } = services

    super({
      ...params,
      service: accords.requests,
      entity: 'accords',
      schema: StageAccordRequestThumbnailSchema
    })
  }
}