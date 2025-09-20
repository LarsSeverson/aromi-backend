import type { BrandRequestRow } from '@aromi/shared'
import { UpdateRequestResolver } from '@src/features/requests/helpers/UpdateRequestResolver.js'
import type { MutationResolvers, MutationUpdateBrandRequestArgs } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapBrandRequestRowToBrandRequestSummary, mapUpdateBrandRequestInputToRow } from '../utils/mappers.js'

type Mutation = MutationResolvers['updateBrandRequest']

export class UpdateBrandRequestResolver extends UpdateRequestResolver<Mutation, BrandRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { brands } = services

    super({
      ...params,
      service: brands.requests
    })
  }

  mapToOutput = mapBrandRequestRowToBrandRequestSummary

  mapToValues (args: MutationUpdateBrandRequestArgs) {
    const { input } = args
    return mapUpdateBrandRequestInputToRow(input)
  }
}