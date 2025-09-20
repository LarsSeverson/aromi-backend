import { PROMOTION_JOB_NAMES, type FragranceRequestRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { VoteOnRequestResolver } from '@src/features/requests/helpers/VoteOnRequestResolver.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'

type Mutation = MutationResolvers['voteOnFragranceRequest']

export class VoteOnFragranceRequestResolver extends VoteOnRequestResolver<Mutation, FragranceRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { fragrances } = services

    super({
      ...params,
      service: fragrances.requests,
      jobName: PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE
    })
  }

  mapToOutput (request: FragranceRequestRow) {
    return mapFragranceRequestRowToFragranceRequest(request)
  }
}