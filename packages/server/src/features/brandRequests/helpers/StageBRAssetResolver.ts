import type { BrandRequestRow } from '@aromi/shared'
import { StageRequestAssetResolver } from '@src/features/requests/helpers/StageRequestAssetResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { StageBrandRequestImageSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['stageBrandRequestImage']

export class StageBRAssetResolver extends StageRequestAssetResolver<Mutation, BrandRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { brandRequests } = services

    super({
      ...params,
      service: brandRequests,
      entity: 'brands',
      schema: StageBrandRequestImageSchema
    })
  }
}