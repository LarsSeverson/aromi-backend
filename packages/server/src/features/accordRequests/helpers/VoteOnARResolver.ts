import { PROMOTION_JOB_NAMES, type AccordRequestRow } from '@aromi/shared'
import { VoteOnRequestResolver } from '@src/features/requests/helpers/VoteOnRequestResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'

type Mutation = MutationResolvers['voteOnAccordRequest']

export class VoteOnARResolver extends VoteOnRequestResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accordRequests } = services

    super({
      ...params,
      service: accordRequests,
      jobName: PROMOTION_JOB_NAMES.PROMOTE_ACCORD
    })
  }

  mapToOutput (request: AccordRequestRow) {
    return mapAccordRequestRowToAccordRequestSummary(request)
  }
}