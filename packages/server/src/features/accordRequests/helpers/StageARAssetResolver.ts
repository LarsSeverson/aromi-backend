import type { AccordRequestRow } from '@aromi/shared'
import { StageRequestAssetResolver } from '@src/features/requests/helpers/StageRequestAssetResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { StageAccordRequestImageSchema } from '../utils/validation.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'

type Mutation = MutationResolvers['stageAccordRequestImage']

export class StageARAssetResolver extends StageRequestAssetResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accordRequests } = services

    super({
      ...params,
      service: accordRequests,
      entity: 'accords',
      schema: StageAccordRequestImageSchema
    })
  }
}