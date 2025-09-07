import { type DataSources } from '@src/datasources'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { ApiError } from '@src/utils/error'
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { format } from 'url'
import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { createPresignedPost, type PresignedPost } from '@aws-sdk/s3-presigned-post'
import { PRESIGNED_EXP, SIGNED_CDN_URL_EXP, type PresignUploadParams } from '../types'
import { streamToBuffer } from '@src/utils/stream'

export class AssetService {
  s3: DataSources['s3']
  cdn: DataSources['cdn']

  constructor (sources: DataSources) {
    this.s3 = sources.s3
    this.cdn = sources.cdn
  }

  getPresignedUrl (
    params: PresignUploadParams
  ): ResultAsync<PresignedPost, ApiError> {
    const { s3 } = this
    const { client, bucket } = s3
    const { key, contentType, maxSizeBytes, expiresIn = PRESIGNED_EXP } = params

    return ResultAsync
      .fromPromise(
        createPresignedPost(
          client,
          {
            Bucket: bucket,
            Key: key,
            Expires: expiresIn,
            Fields: { 'Content-Type': contentType },
            Conditions: [
              ['content-length-range', 0, maxSizeBytes],
              ['eq', '$Content-Type', contentType]
            ]
          }
        ),
        error => ApiError.fromS3(error)
      )
  }

  getCdnUrl (
    key: string
  ): string {
    const { cdn } = this
    const { domain } = cdn

    return format(`${domain}/${encodeURI(key)}`)
  }

  getCdnSignedUrl (
    key: string
  ): string {
    const { cdn } = this
    const { keyPairId, privateKey } = cdn

    const url = this.getCdnUrl(key)

    return getSignedUrl({
      url,
      keyPairId,
      privateKey,
      dateLessThan: SIGNED_CDN_URL_EXP()
    })
  }

  getFromS3 (
    key: string
  ): ResultAsync<Buffer, ApiError> {
    const { s3 } = this
    const { client, bucket } = s3

    return ResultAsync
      .fromPromise(
        client
          .send(new GetObjectCommand({
            Bucket: bucket,
            Key: key
          })),
        error => ApiError.fromS3(error)
      )
      .andThen(output => {
        if (output.Body == null) {
          return errAsync(
            new ApiError(
              'NoBody',
              'S3 object had no body',
              500
            )
          )
        }
        return okAsync(output.Body)
      })
      .andThen(body => streamToBuffer(body as NodeJS.ReadableStream))
  }

  copyInS3 (
    sourceKey: string,
    destinationKey: string
  ): ResultAsync<string, ApiError> {
    const { s3 } = this
    const { client, bucket } = s3

    return ResultAsync
      .fromPromise(
        client
          .send(new CopyObjectCommand({
            Bucket: bucket,
            CopySource: `${bucket}/${sourceKey}`,
            Key: destinationKey
          })),
        error => ApiError.fromS3(error)
      )
      .map(() => destinationKey)
  }

  deleteFromS3 (
    key: string
  ): ResultAsync<boolean, ApiError> {
    const { s3 } = this
    const { client, bucket } = s3

    return ResultAsync
      .fromPromise(
        client
          .send(new DeleteObjectCommand({
            Bucket: bucket,
            Key: key
          })),
        error => ApiError.fromS3(error)
      )
      .map(() => true)
  }
}
