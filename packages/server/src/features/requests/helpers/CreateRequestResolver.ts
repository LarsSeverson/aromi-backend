import { BackendError, unwrapOrThrow, type RequestService, type SomeRequestRow } from '@aromi/shared'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import type { Args, ResolverReturn } from '@src/utils/types.js'
import { errAsync, type ResultAsync } from 'neverthrow'

export interface CreateRequestParams<TR, R extends SomeRequestRow> extends RequestResolverParams<TR> {
  service: RequestService<R>
}

export abstract class CreateRequestResolver<TR, R extends SomeRequestRow = SomeRequestRow> extends MutationResolver<TR> {
  protected service: RequestService<R>
  protected trxService?: RequestService<R>

  constructor (params: CreateRequestParams<TR, R>) {
    super(params)
    this.service = params.service
  }

  abstract mapToOutput (request: R): ResolverReturn<TR>
  abstract mapToValues (args: Args<TR>): Partial<R>

  resolve (): ResultAsync<ResolverReturn<TR>, BackendError> {
    const { service } = this

    if (this.trxService != null) {
      return errAsync(
        new BackendError(
          'ALREADY_INITIALIZED',
          'Transaction service already initialized',
          500
        )
      )
    }

    return service
      .withTransactionAsync(async trxService => {
        this.trxService = trxService
        return await this.handleCreateRequest()
      })
      .map(({ request }) => this.mapToOutput(request))
  }

  private async handleCreateRequest () {
    const request = await unwrapOrThrow(this.handleCreateRequestRow())
    const counts = await unwrapOrThrow(this.handleCreateRequestVoteCountRow(request.id))

    return { request, counts }
  }

  private handleCreateRequestRow () {
    const values = this.mapToValues(this.args)
    const userId = this.me.id

    const createValues = { ...values, userId }

    return this
      .trxService!
      .createOne(createValues)
  }

  private handleCreateRequestVoteCountRow (requestId: string) {
    return this
      .trxService!
      .votes
      .counts
      .createOne({ requestId })
  }
}