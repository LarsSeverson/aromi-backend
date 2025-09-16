import { BackendError, unwrapOrThrow, type RequestService, type SomeRequestRow } from '@aromi/shared'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { errAsync, type ResultAsync } from 'neverthrow'
import { RequestMutationResolver } from './RequestMutationResolver.js'
import type { Args, ResolverReturn } from '@src/utils/types.js'

interface UpdateRequestArgs {
  input: {
    id: string
  }
}

export interface UpdateRequestParams<TR, R extends SomeRequestRow> extends RequestResolverParams<TR, UpdateRequestArgs> {
  service: RequestService<R>
}

export abstract class UpdateRequestResolver<TR, R extends SomeRequestRow = SomeRequestRow> extends RequestMutationResolver<TR, UpdateRequestArgs> {
  protected service: RequestService<R>
  protected trxService?: RequestService

  constructor (params: UpdateRequestParams<TR, R>) {
    super(params)
    this.service = params.service
  }

  abstract mapToOutput (request: R): ResolverReturn<TR>
  abstract mapToValues (input: Args<TR>): Partial<R>

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
        this.trxService = trxService as unknown as RequestService
        return await this.handleUpdateRequest()
      })
      .map(request => this.mapToOutput(request as R))
  }

  private async handleUpdateRequest () {
    const { id } = this.args.input
    const values = this.mapToValues(this.args)

    return await unwrapOrThrow(
      this
        .trxService!
        .updateOne(
          eb => eb('id', '=', id),
          eb => ({
            ...values,
            version: eb(eb.ref('version'), '+', 1)
          })
        )
        .andThen(request => this.authorizeEdit(request))
    )
  }
}