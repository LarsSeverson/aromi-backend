import type { BrandRequestRow } from '@aromi/shared'
import { CreateRequestResolver } from '@src/features/requests/helpers/CreateRequestResolver.js'
import type { MutationCreateBrandRequestArgs, MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapBrandRequestRowToBrandRequestSummary, mapCreateBrandRequestInputToRow } from '../utils/mappers.js'

type Mutation = MutationResolvers['createBrandRequest']

export class CreateBrandRequestResolver extends CreateRequestResolver<Mutation, BrandRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { brands } = services

    super({
      ...params,
      service: brands.requests
    })
  }

  mapToOutput = mapBrandRequestRowToBrandRequestSummary

  mapToValues (args: Partial<MutationCreateBrandRequestArgs>) {
    const { input } = args
    return mapCreateBrandRequestInputToRow(input)
  }
}
