import { type AssetUploadRow, BackendError, genImageKey, parseOrThrow, unwrapOrThrow, type RequestService, type S3Entity, type SomeRequestRow } from '@aromi/shared'
import type { PresignedUpload, StageAssetInput } from '@src/graphql/gql-types.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { errAsync, type ResultAsync } from 'neverthrow'
import { GenericStageRequestAssetSchema } from '../utils/validation.js'
import type z from 'zod'
import { RequestMutationResolver } from './RequestMutationResolver.js'
import type { Info, Parent } from '@src/utils/types.js'

interface StageRequestAssetArgs {
  input: StageAssetInput
}

export interface StageRequestAssetParams<TR, R extends SomeRequestRow> extends RequestResolverParams<TR, StageRequestAssetArgs> {
  service: RequestService<R>
  entity: S3Entity
  schema?: z.ZodType<{ contentType: string, contentSize: number }>
}

export abstract class StageRequestAssetResolver<TR, R extends SomeRequestRow> extends RequestMutationResolver<
  TR,
  StageRequestAssetArgs,
  Parent<TR>,
  Info<TR>,
  PresignedUpload
> {
  protected service: RequestService<R>
  protected trxService?: RequestService
  protected entity: S3Entity
  protected schema: z.ZodType<{ contentType: string, contentSize: number }>

  constructor (params: StageRequestAssetParams<TR, R>) {
    super(params)
    this.service = params.service
    this.entity = params.entity
    this.schema = params.schema ?? GenericStageRequestAssetSchema
  }

  resolve (): ResultAsync<PresignedUpload, BackendError> {
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
        return await this.handleStageAsset()
      })
      .andThen(
        ({ asset }) => this
          .handlePresignUrl(asset)
          .map(presigned => ({ asset, presigned }))
      )
      .map(
        ({ asset, presigned }) => ({ ...presigned, id: asset.id })
      )
  }

  private async handleStageAsset () {
    const request = await unwrapOrThrow(this.handleGetRequest())
    const asset = await unwrapOrThrow(this.handleCreateAsset())

    return { request, asset }
  }

  private handleGetRequest () {
    const { entityId } = this.args.input

    return this
      .trxService!
      .findOne(
        eb => eb('id', '=', entityId)
      )
      .andThen(request => this.authorizeEdit(request))
  }

  private handleCreateAsset () {
    const { input } = this.args
    const { services } = this.context
    const { assets } = services

    const { entityId, fileName } = input
    const { contentType, contentSize } = parseOrThrow(this.schema, input)
    const { key } = genImageKey(this.entity, fileName)

    const values = {
      requestId: entityId,
      name: fileName,
      contentType,
      sizeBytes: String(contentSize),
      s3Key: key
    }

    return assets
      .uploads
      .createOne(values)
  }

  private handlePresignUrl (asset: AssetUploadRow) {
    const { services } = this.context
    const { assets } = services

    const { s3Key, contentType, sizeBytes } = asset

    return assets.getPresignedUrl({
      key: s3Key,
      contentType,
      maxSizeBytes: Number(sizeBytes)
    })
  }
}