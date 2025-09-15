import type { AccordRequestRow } from '@aromi/shared'
import { UpdateRequestResolver } from '@src/features/requests/helpers/UpdateRequestResolver.js'
import type { MutationResolvers, MutationUpdateAccordRequestArgs } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapAccordRequestRowToAccordRequestSummary, mapUpdateAccordRequestInputToRow } from '../utils/mappers.js'

type Mutation = MutationResolvers['updateAccordRequest']

export class UpdateARResolver extends UpdateRequestResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accordRequests } = services

    super({
      ...params,
      service: accordRequests
    })
  }

  mapToOutput = mapAccordRequestRowToAccordRequestSummary

  mapToValues (args: MutationUpdateAccordRequestArgs) {
    const { input } = args
    return mapUpdateAccordRequestInputToRow(input)
  }
}