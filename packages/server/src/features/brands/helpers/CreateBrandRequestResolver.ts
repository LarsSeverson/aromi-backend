import { parseOrThrow, removeNullish, unwrapOrThrow, type BrandService } from '@aromi/shared'
import { RequestMutationResolver } from '@src/features/requests/helpers/RequestMutationResolver.js'
import { CreateBrandRequestSchema } from '../utils/validation.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['createBrandRequest']

export class CreateBrandRequestResolver extends RequestMutationResolver<Mutation> {
  private trxService?: BrandService

  async resolve () {
    const { context } = this
    const { services } = context
    const { brands } = services

    const { request } = await unwrapOrThrow(
      brands.withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.handleCreateRequest()
      })
    )

    return mapBrandRequestRowToBrandRequestSummary(request)
  }

  private async handleCreateRequest () {
    const request = await unwrapOrThrow(this.createRequest())
    const score = await unwrapOrThrow(this.createScore(request.id))

    return { request, score }
  }

  private createRequest () {
    const values = this.getValues()

    return this
      .trxService!
      .requests
      .createOne(values)
  }

  private createScore (requestId: string) {
    return this
      .trxService!
      .requests
      .votes
      .scores
      .createOne({ requestId })
  }

  private getValues () {
    const { me, args } = this
    const { input } = args

    const userId = me.id
    const parsed = parseOrThrow(CreateBrandRequestSchema, input ?? {})
    const cleaned = removeNullish(parsed)

    const values = { ...cleaned, userId }

    return values
  }
}
