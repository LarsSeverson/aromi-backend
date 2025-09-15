import type { BrandRequestRow } from '@aromi/shared'
import { DeleteRequestResolver } from '@src/features/requests/helpers/DeleteRequestResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['deleteBrandRequest']

export class DeleteBRResolver extends DeleteRequestResolver<Mutation, BrandRequestRow> {
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