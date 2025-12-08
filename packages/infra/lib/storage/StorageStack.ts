import { Bucket } from 'aws-cdk-lib/aws-s3'
import { BaseStack } from '../BaseStack.js'
import type { StorageStackProps } from './types.js'
import { StorageConfig } from './components/StorageConfig.js'

export class StorageStack extends BaseStack {
  readonly bucketId: string
  readonly bucket: Bucket

  constructor (props: StorageStackProps) {
    const { app } = props
    super({ app, stackName: 'storage' })

    this.bucketId = `${this.prefix}-bucket`
    this.bucket = new Bucket(this, this.bucketId, {
      bucketName: this.bucketId,

      versioned: true,
      encryption: StorageConfig.S3_CONFIG.ENCRYPTION,

      blockPublicAccess: StorageConfig.S3_CONFIG.PUBLIC_ACCESS,
      objectOwnership: StorageConfig.S3_CONFIG.OBJECT_OWNERSHIP,

      cors: StorageConfig.S3_CONFIG.CORS,
      lifecycleRules: StorageConfig.S3_CONFIG.LIFECYCLE_RULES,

      removalPolicy: StorageConfig.S3_CONFIG.REMOVAL_POLICY
    })
  }
}
