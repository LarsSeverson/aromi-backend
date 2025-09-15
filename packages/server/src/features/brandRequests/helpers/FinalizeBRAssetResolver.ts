import type { BrandRequestRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'
import { FinalizeRequestAssetResolver } from '@src/features/requests/helpers/FinalizeRequestAssetResolver.js'

type Mutation = MutationResolvers['finalizeBrandRequestImage']

export class FinalizeBRResolver extends FinalizeRequestAssetResolver<Mutation, BrandRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { brandRequests } = services

    super({
      ...params,
      service: brandRequests
    })
  }

  mapToOutput = mapBrandRequestRowToBrandRequestSummary
}