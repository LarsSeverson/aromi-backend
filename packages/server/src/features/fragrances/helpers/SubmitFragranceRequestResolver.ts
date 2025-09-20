import { parseOrErr, ValidFragrance, type BackendError, type FragranceRequestRow } from '@aromi/shared'
import { SubmitRequestResolver } from '@src/features/requests/helpers/SubmitRequestResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import type { Result } from 'neverthrow'

type Mutation = MutationResolvers['submitFragranceRequest']

export class SubmitFragranceRequestResolver extends SubmitRequestResolver<Mutation, FragranceRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { fragrances } = services

    super({
      ...params,
      service: fragrances.requests
    })
  }

  mapToOutput = mapFragranceRequestRowToFragranceRequest

  validateRequest (
    request: FragranceRequestRow
  ): Result<FragranceRequestRow, BackendError> {
    return parseOrErr(ValidFragrance, request).map(() => request)
  }
}