import { BackendError, unwrapOrThrow, type RequestService, type SomeRequestRow } from '@aromi/shared'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { errAsync, type ResultAsync } from 'neverthrow'
import { RequestMutationResolver } from './RequestMutationResolver.js'
import type { ResolverReturn } from '@src/utils/types.js'

interface DeleteRequestArgs {
  input: {
    id: string
  }
}

export interface DeleteRequestParams<TR, R extends SomeRequestRow> extends RequestResolverParams<TR, DeleteRequestArgs> {
  service: RequestService<R>
}

export abstract class DeleteRequestResolver<TR, R extends SomeRequestRow = SomeRequestRow> extends RequestMutationResolver<TR, DeleteRequestArgs> {
  protected service: RequestService<R>
  protected trxService?: RequestService<R>

  constructor (params: DeleteRequestParams<TR, R>) {
    super(params)
    this.service = params.service
  }

  abstract mapToOutput (request: R): ResolverReturn<TR>

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
        return await this.handleDeleteRequest()
      })
      .map(request => this.mapToOutput(request as R))
  }

  private async handleDeleteRequest () {
    const { id } = this.args.input

    return await unwrapOrThrow(
      (this.trxService as unknown as RequestService)
        .softDeleteOne(
          eb => eb('id', '=', id)
        )
        .andThen(request => this.authorizeEdit(request))
    )
  }
}