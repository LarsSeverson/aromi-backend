import type { FragranceRequestRow } from '@aromi/shared'
import { FinalizeRequestAssetResolver } from '@src/features/requests/helpers/FinalizeRequestAssetResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'

type Mutation = MutationResolvers['finalizeFragranceRequestImage']

export class FinalizeFRAssetResolver extends FinalizeRequestAssetResolver<Mutation, FragranceRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { fragranceRequests } = services

    super({
      ...params,
      service: fragranceRequests
    })
  }

  mapToOutput = mapFragranceRequestRowToFragranceRequest
}