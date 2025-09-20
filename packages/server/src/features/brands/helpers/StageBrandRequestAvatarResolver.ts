import type { BrandRequestRow } from '@aromi/shared'
import { StageRequestAssetResolver } from '@src/features/requests/helpers/StageRequestAssetResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { StageBrandRequestAvatarSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['stageBrandRequestAvatar']

export class StageBrandRequestAvatarResolver extends StageRequestAssetResolver<Mutation, BrandRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { brands } = services

    super({
      ...params,
      service: brands.requests,
      entity: 'brands',
      schema: StageBrandRequestAvatarSchema
    })
  }
}