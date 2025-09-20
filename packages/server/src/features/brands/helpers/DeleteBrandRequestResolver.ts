import type { BrandRequestRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'
import { DeleteRequestResolver } from '@src/features/requests/helpers/DeleteRequestResolver.js'

type Mutation = MutationResolvers['deleteBrandRequest']

export class DeleteBrandRequestResolver extends DeleteRequestResolver<Mutation, BrandRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { brands } = services

    super({
      ...params,
      service: brands.requests
    })
  }

  mapToOutput = mapBrandRequestRowToBrandRequestSummary
}