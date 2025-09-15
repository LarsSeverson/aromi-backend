import { type AccordRequestRow, parseOrErr, ValidAccord, type BackendError } from '@aromi/shared'
import { SubmitRequestResolver } from '@src/features/requests/helpers/SubmitRequestResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import type { Result } from 'neverthrow'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['submitAccordRequest']

export class SubmitARResolver extends SubmitRequestResolver<Mutation, AccordRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { accordRequests } = services

    super({
      ...params,
      service: accordRequests
    })
  }

  mapToOutput = mapAccordRequestRowToAccordRequestSummary

  validateRequest (
    request: AccordRequestRow
  ): Result<AccordRequestRow, BackendError> {
    return parseOrErr(ValidAccord, request).map(() => request)
  }
}