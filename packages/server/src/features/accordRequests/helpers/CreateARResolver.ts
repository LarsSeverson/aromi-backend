import type { MutationCreateAccordRequestArgs, MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapAccordRequestRowToAccordRequestSummary, mapCreateAccordRequestInputToRow } from '../utils/mappers.js'
import { CreateRequestResolver } from '@src/features/requests/helpers/CreateRequestResolver.js'
import type { AccordRequestRow } from '@aromi/shared'

type Mutation = MutationResolvers['createAccordRequest']

export class CreateARResolver extends CreateRequestResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accordRequests } = services

    super({
      ...params,
      service: accordRequests
    })
  }

  mapToOutput = mapAccordRequestRowToAccordRequestSummary
  mapToValues (args: Partial<MutationCreateAccordRequestArgs>) {
    const { input } = args
    return mapCreateAccordRequestInputToRow(input)
  }
}