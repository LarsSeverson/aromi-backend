import { type DataSources } from '@src/datasources'
import { ApiService } from '@src/services/ApiService'
import { type PresignUploadParams } from '../types'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { PRESIGNED_EXP } from '../constants'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export class AssetService extends ApiService {
  s3: DataSources['s3']

  constructor (sources: DataSources) {
    super(sources)
    this.s3 = sources.s3
  }

  presignUpload (
    params: PresignUploadParams
  ): ResultAsync<string, ApiError> {
    const { s3 } = this
    const { client, bucket } = s3
    const { key, contentType } = params

    return ResultAsync
      .fromPromise(
        getSignedUrl(
          client,
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: contentType
          }),
          { expiresIn: PRESIGNED_EXP }
        ),
        error => ApiError.fromS3(error)
      )
  }
}
