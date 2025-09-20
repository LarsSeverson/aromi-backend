import { BackendError, RequestStatus, unwrapOrThrow, type RequestService, type SomeRequestRow } from '@aromi/shared'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { errAsync, type Result, type ResultAsync } from 'neverthrow'
import { RequestMutationResolver } from './RequestMutationResolver.js'
import type { ResolverReturn } from '@src/utils/types.js'

interface SubmitRequestArgs {
  input: {
    id: string
  }
}

export interface SubmitRequestParams<TR, R extends SomeRequestRow> extends RequestResolverParams<TR, SubmitRequestArgs> {
  service: RequestService<R>
}

export abstract class SubmitRequestResolver<TR, R extends SomeRequestRow = SomeRequestRow> extends RequestMutationResolver<TR, SubmitRequestArgs> {
  protected service: RequestService<R>
  protected trxService?: RequestService

  constructor (params: SubmitRequestParams<TR, R>) {
    super(params)
    this.service = params.service
  }

  abstract mapToOutput (request: R): ResolverReturn<TR>
  abstract validateRequest (request: R): ResultAsync<R, BackendError> | Result<R, BackendError>

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
        return await this.handleSubmitRequest()
      })
      .map(request => this.mapToOutput(request))
  }

  private async handleSubmitRequest () {
    const request = await unwrapOrThrow(this.handleUpdateRequest())
    return request
  }

  private handleUpdateRequest () {
    const { id } = this.args.input

    return this
      .trxService!
      .updateOne(
        eb => eb('id', '=', id),
        { requestStatus: RequestStatus.PENDING }
      )
      .andThen(request => this.authorizeEdit(request))
      .andThen(request => this.validateRequest(request as R))
  }
}