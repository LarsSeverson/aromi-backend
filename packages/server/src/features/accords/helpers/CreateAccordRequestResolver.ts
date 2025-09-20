import type { MutationCreateAccordRequestArgs, MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapAccordRequestRowToAccordRequestSummary, mapCreateAccordRequestInputToRow } from '../utils/mappers.js'
import { CreateRequestResolver } from '@src/features/requests/helpers/CreateRequestResolver.js'
import type { AccordRequestRow } from '@aromi/shared'

type Mutation = MutationResolvers['createAccordRequest']

export class CreateAccordRequestResolver extends CreateRequestResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accords } = services

    super({
      ...params,
      service: accords.requests
    })
  }

  mapToOutput = mapAccordRequestRowToAccordRequestSummary

  mapToValues (args: Partial<MutationCreateAccordRequestArgs>) {
    const { input } = args
    return mapCreateAccordRequestInputToRow(input)
  }
}