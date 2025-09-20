import { PROMOTION_JOB_NAMES, type BrandRequestRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { IBrandRequestSummary } from '../types.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'
import { VoteOnRequestResolver } from '@src/features/requests/helpers/VoteOnRequestResolver.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'

type Mutation = MutationResolvers['voteOnBrandRequest']

export class VoteOnBrandRequestResolver extends VoteOnRequestResolver<Mutation, BrandRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { brands } = services

    super({
      ...params,
      service: brands.requests,
      jobName: PROMOTION_JOB_NAMES.PROMOTE_BRAND
    })
  }

  mapToOutput (request: BrandRequestRow): IBrandRequestSummary {
    return mapBrandRequestRowToBrandRequestSummary(request)
  }
}