import type { FragranceRequestRow } from '@aromi/shared'
import { UpdateRequestResolver } from '@src/features/requests/helpers/UpdateRequestResolver.js'
import type { MutationResolvers, MutationUpdateFragranceRequestArgs } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapFragranceRequestRowToFragranceRequest, mapUpdateFragranceRequestInputToRow } from '../utils/mappers.js'

type Mutation = MutationResolvers['updateFragranceRequest']

export class UpdateFragranceRequestResolver extends UpdateRequestResolver<Mutation, FragranceRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { fragrances } = services

    super({
      ...params,
      service: fragrances.requests
    })
  }

  mapToOutput = mapFragranceRequestRowToFragranceRequest
  mapToValues (args: MutationUpdateFragranceRequestArgs) {
    const { input } = args
    return mapUpdateFragranceRequestInputToRow(input)
  }
}