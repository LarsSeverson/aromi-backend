import type { FragranceRequestRow } from '@aromi/shared'
import { StageRequestAssetResolver } from '@src/features/requests/helpers/StageRequestAssetResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { StageFragranceRequestImageSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['stageFragranceRequestImage']

export class StageFRAssetResolver extends StageRequestAssetResolver<Mutation, FragranceRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { fragranceRequests } = services

    super({
      ...params,
      service: fragranceRequests,
      entity: 'fragrances',
      schema: StageFragranceRequestImageSchema
    })
  }
}