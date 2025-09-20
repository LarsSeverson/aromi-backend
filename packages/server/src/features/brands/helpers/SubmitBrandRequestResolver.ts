import { parseOrErr, ValidBrand, type BackendError, type BrandRequestRow } from '@aromi/shared'
import { SubmitRequestResolver } from '@src/features/requests/helpers/SubmitRequestResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import type { Result } from 'neverthrow'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['submitBrandRequest']

export class SubmitBrandRequestResolver extends SubmitRequestResolver<Mutation, BrandRequestRow> {
  constructor (params: RequestResolverParams<Mutation>) {
    const { services } = params.context
    const { brands } = services

    super({
      ...params,
      service: brands.requests
    })
  }

  mapToOutput = mapBrandRequestRowToBrandRequestSummary

  validateRequest (
    request: BrandRequestRow
  ): Result<BrandRequestRow, BackendError> {
    return parseOrErr(ValidBrand, request).map(() => request)
  }
}