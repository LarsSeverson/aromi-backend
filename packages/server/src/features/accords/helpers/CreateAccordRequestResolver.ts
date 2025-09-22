import { RequestMutationResolver } from '@src/features/requests/helpers/RequestMutationResolver.js'
import { CreateAccordRequestSchema } from '../utils/validation.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { type AccordService, parseOrThrow, removeNullish, unwrapOrThrow } from '@aromi/shared'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['createAccordRequest']

export class CreateAccordRequestResolver extends RequestMutationResolver<Mutation> {
  private trxService?: AccordService

  async resolve () {
    const { context } = this
    const { services } = context
    const { accords } = services

    const { request } = await unwrapOrThrow(
      accords.withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.handleCreateRequest()
      })
    )

    return mapAccordRequestRowToAccordRequestSummary(request)
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
    const parsed = parseOrThrow(CreateAccordRequestSchema, input ?? {})
    const cleaned = removeNullish(parsed)

    const values = { ...cleaned, userId }

    return values
  }
}