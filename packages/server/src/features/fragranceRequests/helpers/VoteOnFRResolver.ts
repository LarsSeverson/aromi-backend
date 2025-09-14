import { PROMOTION_JOB_NAMES, type FragranceRequestRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { VoteOnRequestResolver } from '@src/features/requests/helpers/VoteOnRequestResolver.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'

type Mutation = MutationResolvers['voteOnFragranceRequest']

export class VoteOnFRResolver extends VoteOnRequestResolver<Mutation, FragranceRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { fragranceRequests } = services

    super({
      ...params,
      service: fragranceRequests,
      jobName: PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE
    })
  }

  mapToOutput (request: FragranceRequestRow) {
    return mapFragranceRequestRowToFragranceRequest(request)
  }
}