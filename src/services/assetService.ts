import { type ApiDataSources } from '@src/datasources/datasources'
import { ApiService } from './apiService'
import { errAsync, ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { createPresignedPost, type PresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { HeadObjectCommand } from '@aws-sdk/client-s3'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const EXPIRES_IN = 3600

export class AssetService extends ApiService {
  s3: ApiDataSources['s3']
  cloudfront: ApiDataSources['cloudfront']

  constructor (sources: ApiDataSources) {
    super()
    this.s3 = sources.s3
    this.cloudfront = sources.cloudfront
  }

  signAsset <A extends BaseAsset>(
    asset: A
  ): A {
    asset.src = this.signUrl(asset.src)
    return asset
  }

  signUrl (
    key: string
  ): string {
    const { cloudfront } = this
    const { domain, keyPairId, privateKey } = cloudfront

    const url = `${domain}/${key}`

    return getSignedUrl({
      url,
      keyPairId,
      privateKey,
      dateLessThan: new Date(Date.now() + EXPIRES_IN * 1000)
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
}

export interface PresignUploadParams {
  key: string
  fileSize: number
  fileType: string
}

export interface BaseAsset {
  src: string
}
