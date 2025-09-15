import { BackendError, genImageKey, parseOrThrow, type SomeRequestImageRow, unwrapOrThrow, type RequestService, type S3Entity, type SomeRequestRow } from '@aromi/shared'
import type { PresignedUpload, StageAssetInput } from '@src/graphql/gql-types.js'
import type { RequestResolverParams, Parent, Info } from '@src/resolvers/RequestResolver.js'
import { errAsync, type ResultAsync } from 'neverthrow'
import { GenericStageRequestAssetSchema } from '../utils/validation.js'
import type z from 'zod'
import { RequestMutationResolver } from './RequestMutationResolver.js'

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
    const { id } = this.args.input

    return this
      .trxService!
      .findOne(
        eb => eb('id', '=', id)
      )
      .andThen(request => this.authorizeEdit(request))
  }

  private handleCreateAsset () {
    const { input } = this.args

    const { id, fileName } = input
    const { contentType, contentSize } = parseOrThrow(this.schema, input)
    const { key } = genImageKey(this.entity, fileName)

    const values = {
      requestId: id,
      name: fileName,
      contentType,
      sizeBytes: String(contentSize),
      s3Key: key
    }

    return this
      .trxService!
      .images
      .createOne(values)
  }

  private handlePresignUrl (asset: SomeRequestImageRow) {
    const { services } = this.context
    const { assets } = services

    return assets.getPresignedUrl({
      key: asset.s3Key,
      contentType: asset.contentType,
      maxSizeBytes: Number(asset.sizeBytes)
    })
  }
}