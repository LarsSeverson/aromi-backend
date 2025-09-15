import { AssetStatus, BackendError, type SomeRequestImageRow, unwrapOrThrow, type RequestService, type SomeRequestRow } from '@aromi/shared'
import type { RequestResolverParams, ResolverReturn } from '@src/resolvers/RequestResolver.js'
import { errAsync, okAsync, type ResultAsync } from 'neverthrow'
import { RequestMutationResolver } from './RequestMutationResolver.js'

interface FinalizeRequestAssetArgs {
  input: {
    requestId: string,
    assetId: string
  }
}

export interface FinalizeRequestAssetParams<TR, R extends SomeRequestRow> extends RequestResolverParams<TR, FinalizeRequestAssetArgs> {
  service: RequestService<R>
}

export abstract class FinalizeRequestAssetResolver<TR, R extends SomeRequestRow = SomeRequestRow> extends RequestMutationResolver<TR, FinalizeRequestAssetArgs> {
  protected service: RequestService<R>
  protected trxService?: RequestService<R>

  constructor (params: FinalizeRequestAssetParams<TR, R>) {
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
        return await this.handleUpdateAsset()
      })
      .andThrough(({ oldAsset }) => this.handleDeleteFromS3(oldAsset))
      .map(({ request }) => this.mapToOutput(request as R))
  }

  private async handleUpdateAsset () {
    const request = await unwrapOrThrow(this.handleUpdateRequest())
    const oldAsset = await unwrapOrThrow(this.handleDeleteOldAsset())
    const newAsset = await unwrapOrThrow(this.handleUpdateNewAsset())

    return { request, oldAsset, newAsset }
  }

  private handleUpdateRequest () {
    const { input } = this.args

    const { requestId } = input
    const values = { updatedAt: new Date().toISOString() }

    return (this.trxService as unknown as RequestService)
      .updateOne(
        eb => eb('id', '=', requestId),
        eb => ({
          ...values,
          version: eb(eb.ref('version'), '+', 1)
        })
      )
      .andThen(request => this.authorizeEdit(request))
  }

  private handleDeleteOldAsset () {
    const { input } = this.args

    const { requestId } = input

    return this
      .trxService!
      .images
      .softDeleteOne(
        eb => eb.and([
          eb('requestId', '=', requestId),
          eb('status', '=', AssetStatus.READY)
        ])
      )
      .orElse(error => {
        if (error.status === 404) return okAsync(null)
        return errAsync(error)
      })
  }

  private handleUpdateNewAsset () {
    const { input } = this.args

    const { requestId, assetId } = input

    return this
      .trxService!
      .images
      .updateOne(
        eb => eb.and([
          eb('requestId', '=', requestId),
          eb('id', '=', assetId),
          eb('status', '=', AssetStatus.STAGED)
        ]),
        { status: AssetStatus.READY }
      )
  }

  private handleDeleteFromS3 (
    oldAsset: SomeRequestImageRow | null
  ) {
    if (oldAsset == null) return okAsync()

    const { services } = this.context
    const { assets } = services

    return assets
      .deleteFromS3(oldAsset.s3Key)
      .orElse(() => okAsync())
  }
}