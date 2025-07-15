import { type ApiDataSources } from '@src/datasources/datasources'
import { ApiService } from './ApiService'
import { errAsync, ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { createPresignedPost, type PresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { nanoid } from 'nanoid'
import { format } from 'url'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const EXP = (): number => Math.floor((new Date()).getTime() / 1000) + (60 * 60 * 1) // 1 hr

export class AssetService extends ApiService {
  s3: ApiDataSources['s3']
  cloudfront: ApiDataSources['cloudfront']

  constructor (sources: ApiDataSources) {
    super(sources)
    this.s3 = sources.s3
    this.cloudfront = sources.cloudfront
  }

  publicize <A extends BaseAsset>(
    asset: A
  ): A {
    asset.src = this.getUrl(asset.src)
    return asset
  }

  publicizeField (
    field: string
  ): string {
    return this.getUrl(field)
  }

  sign <A extends BaseAsset>(
    asset: A
  ): A {
    asset.src = this.signUrl(asset.src)
    return asset
  }

  genKey (pre: string): string {
    return `${pre}/${nanoid(8)}`
  }

  getUrl (
    key: string
  ): string {
    const { cloudfront } = this
    const { domain } = cloudfront

    const url = format(`${domain}/${encodeURI(key)}`)

    return url
  }

  signUrl (
    key: string
  ): string {
    const { cloudfront } = this
    const { domain, keyPairId, privateKey } = cloudfront

    const url = format(`${domain}/${encodeURI(key)}`)

    return getSignedUrl({
      url,
      keyPairId,
      privateKey,
      dateLessThan: EXP()
    })
  }

  presignUpload (
    params: PresignUploadParams
  ): ResultAsync<PresignedPost, ApiError> {
    const { s3 } = this
    const { client, bucket } = s3
    const { key, fileSize, fileType } = params

    if (fileSize > MAX_SIZE) {
      return errAsync(new ApiError(
        'INVALID_INPUT',
        'The uploaded file is too large. Maximum allowed size is 5MB.',
        400,
        `File size provided: ${fileSize} bytes. Maximum size: ${MAX_SIZE} bytes.`
      ))
    }

    return ResultAsync
      .fromPromise(
        createPresignedPost(client, {
          Bucket: bucket,
          Key: key,
          Conditions: [
            ['content-length-range', 0, MAX_SIZE]
          ],
          Fields: {
            'Content-Type': fileType
          },
          Expires: 3600
        }),
        error => ApiError.fromS3(error as Error)
      )
  }

  checkExists (
    key: string
  ): ResultAsync<boolean, ApiError> {
    const { s3 } = this
    const { client, bucket } = s3

    return ResultAsync
      .fromPromise(
        client.send(new HeadObjectCommand({
          Bucket: bucket,
          Key: key
        })),
        error => ApiError.fromS3(error as Error)
      )
      .map(_ => true)
  }

  validateImage (
    key: string
  ): ResultAsync<boolean, ApiError> {
    const { s3 } = this
    const { client, bucket } = s3

    return ResultAsync
      .fromPromise(
        client.send(new GetObjectCommand({
          Bucket: bucket,
          Key: key
        })),
        error => ApiError.fromS3(error as Error)
      )
      .andThen(data => {
        if (data.Body == null) {
          return errAsync(new ApiError(
            'ASSET_ERROR',
            'Something went wrong uploading this image',
            500,
            'data.Body was undefined'
          ))
        }

        return ResultAsync
          .fromPromise(
            data.Body.transformToByteArray(),
            error => new ApiError(
              'ASSET_ERROR',
              'Something went wrong uploading this image',
              500,
              error
            )
          )
      })
      .andThen(buf => ResultAsync
        .fromPromise(
          sharp(buf).metadata(),
          error => new ApiError(
            'ASSET_ERROR',
            'Something went wrong uploading this image',
            500,
            error
          )
        )
      )
      .map(_ => true)
  }

  delete (key: string): ResultAsync<boolean, ApiError> {
    const { s3 } = this
    const { client, bucket } = s3

    return ResultAsync
      .fromPromise(
        client.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: key
        })),
        error => ApiError.fromS3(error as Error)
      )
      .map(_ => true)
  }
}

export interface PresignUploadParams {
  key: string
  fileSize: number
  fileType: string
}

export interface BaseAsset {
  src: string
}
