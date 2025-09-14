import { BackendError, genImageKey, parseOrThrow, RequestStatus, type RequestService, type S3Entity, type SomeRequestRow } from '@aromi/shared'
import type { StageAssetInput } from '@src/graphql/gql-types.js'
import { AuthenticatedRequestResolver } from '@src/resolvers/AuthenticatedRequestResolver.js'
import type { ResolverReturnType, RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { errAsync, type ResultAsync } from 'neverthrow'
import { GenericStageRequestAssetSchema } from '../utils/validation.js'

interface StageRequestAssetArgs {
  input: StageAssetInput
}

export interface StageRequestAssetParams<
  TResolver,
  R extends SomeRequestRow
> extends RequestResolverParams<TResolver, StageRequestAssetArgs> {
  service: RequestService<R>
  entity: S3Entity
  schema?: typeof GenericStageRequestAssetSchema
}

export abstract class StageRequestAssetResolver<
  TResolver,
  R extends SomeRequestRow
> extends AuthenticatedRequestResolver<TResolver, StageRequestAssetArgs> {
  protected service: RequestService<R>
  protected trxService?: RequestService<R>
  protected entity: S3Entity
  protected schema: typeof GenericStageRequestAssetSchema

  constructor (params: StageRequestAssetParams<TResolver, R>) {
    super(params)
    this.service = params.service
    this.entity = params.entity
    this.schema = params.schema ?? GenericStageRequestAssetSchema
  }

  resolve (): ResultAsync<ResolverReturnType<TResolver>, BackendError> {
    const { services } = this.context
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

    const { assets } = services

    return service
      .withTransaction(trxService => {
        this.trxService = trxService
        return this.handleStageAsset()
      })
      .andThen(
        (newRow) => {
          const { s3Key, contentType, sizeBytes } = newRow

          return assets
            .getPresignedUrl({
              key: s3Key,
              contentType,
              maxSizeBytes: Number(sizeBytes)
            })
            .map(presigned => ({ newRow, presigned }))
        }
      )
      .map(
        ({ newRow, presigned }) => ({ ...presigned, id: newRow.id } satisfies ResolverReturnType<TResolver>)
      )
  }

  private handleStageAsset () {
    const { input } = this.args

    const { id, fileName } = input
    const { contentType, contentSize } = parseOrThrow(this.schema, input)
    const { key } = genImageKey(this.entity, fileName)
    const userId = this.me.id

    const values = {
      requestId: id,
      name: fileName,
      contentType,
      sizeBytes: String(contentSize),
      s3Key: key
    }

    return (this.trxService as unknown as RequestService)
      .findOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', userId),
          eb('requestStatus', 'not in', [RequestStatus.ACCEPTED, RequestStatus.DENIED])
        ])
      )
      .andThen(() => this
        .trxService!
        .images
        .createOne(values)
      )
  }
}