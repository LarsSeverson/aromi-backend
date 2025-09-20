import type { AccordRequestRow } from '@aromi/shared'
import { UpdateRequestResolver } from '@src/features/requests/helpers/UpdateRequestResolver.js'
import type { MutationResolvers, MutationUpdateAccordRequestArgs } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapAccordRequestRowToAccordRequestSummary, mapUpdateAccordRequestInputToRow } from '../utils/mappers.js'

type Mutation = MutationResolvers['updateAccordRequest']

export class UpdateAccordRequestResolver extends UpdateRequestResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accords } = services

    super({
      ...params,
      service: accords.requests
    })
  }

  mapToOutput = mapAccordRequestRowToAccordRequestSummary

  mapToValues (args: MutationUpdateAccordRequestArgs) {
    const { input } = args
    return mapUpdateAccordRequestInputToRow(input)
  }
}