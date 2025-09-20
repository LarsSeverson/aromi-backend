import type { FragranceRequestRow } from '@aromi/shared'
import { CreateRequestResolver } from '@src/features/requests/helpers/CreateRequestResolver.js'
import type { MutationCreateFragranceRequestArgs, MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapCreateFragranceRequestInputToRow, mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'

type Mutation = MutationResolvers['createFragranceRequest']

export class CreateFragranceRequestResolver extends CreateRequestResolver<Mutation, FragranceRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { fragrances } = services

    super({
      ...params,
      service: fragrances.requests
    })
  }

  mapToOutput = mapFragranceRequestRowToFragranceRequest

  mapToValues (args: Partial<MutationCreateFragranceRequestArgs>) {
    const { input } = args
    return mapCreateFragranceRequestInputToRow(input)
  }
}