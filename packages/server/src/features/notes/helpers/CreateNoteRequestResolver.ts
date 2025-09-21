import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers.js'
import { RequestMutationResolver } from '@src/features/requests/helpers/RequestMutationResolver.js'
import { type NoteService, parseOrThrow, removeNullish, unwrapOrThrow } from '@aromi/shared'
import { CreateNoteRequestSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['createNoteRequest']

export class CreateNoteRequestResolver extends RequestMutationResolver<Mutation> {
  private trxService?: NoteService

  async resolve () {
    const { context } = this
    const { services } = context
    const { notes } = services

    const { request } = await unwrapOrThrow(
      notes.withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.handleCreateRequest()
      })
    )

    return mapNoteRequestRowToNoteRequestSummary(request)
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
    const parsed = parseOrThrow(CreateNoteRequestSchema, input ?? {})
    const cleaned = removeNullish(parsed)

    const values = { ...cleaned, userId }

    return values
  }
}
