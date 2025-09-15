import type { AccordRequestRow } from '@aromi/shared'
import { FinalizeRequestAssetResolver } from '@src/features/requests/helpers/FinalizeRequestAssetResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['finalizeAccordRequestImage']

export class FinalizeARAssetResolver extends FinalizeRequestAssetResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accordRequests } = services

    super({
      ...params,
      service: accordRequests
    })
  }

  mapToOutput = mapAccordRequestRowToAccordRequestSummary
}