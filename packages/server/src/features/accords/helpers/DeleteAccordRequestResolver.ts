import type { AccordRequestRow } from '@aromi/shared'
import { DeleteRequestResolver } from '@src/features/requests/helpers/DeleteRequestResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['deleteAccordRequest']

export class DeleteAccordRequestResolver extends DeleteRequestResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accords } = services

    super({
      ...params,
      service: accords.requests
    })
  }

  mapToOutput = mapAccordRequestRowToAccordRequestSummary
}