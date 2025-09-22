import { parseOrThrow, removeNullish, unwrapOrThrow, type FragranceService } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { RequestMutationResolver } from '@src/features/requests/helpers/RequestMutationResolver.js'
import { CreateFragranceRequestSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['createFragranceRequest']

export class CreateFragranceRequestResolver extends RequestMutationResolver<Mutation> {
  private trxService?: FragranceService

  async resolve () {
    const { context } = this
    const { services } = context
    const { fragrances } = services

    const { request } = await unwrapOrThrow(
      fragrances.withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.handleCreateRequest()
      })
    )

    return mapFragranceRequestRowToFragranceRequest(request)
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
      .scores
      .createOne({ requestId })
  }

  private getValues () {
    const { me, args } = this
    const { input } = args

    const userId = me.id
    const parsed = parseOrThrow(CreateFragranceRequestSchema, input ?? {})
    const cleaned = removeNullish(parsed)

    const values = { ...cleaned, userId }

    return values
  }
}