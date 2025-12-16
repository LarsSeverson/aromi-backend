import { Construct } from 'constructs'
import type { AssetsBucketConstructProps } from '../types.js'
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3'

export class AssetsBucketConstruct extends Construct {
  readonly bucket: Bucket
  readonly bucketId: string

  private readonly internalConfig = {
    cors: {
      allowedHeaders: ['*'],
      allowedMethods: [HttpMethods.GET, HttpMethods.HEAD, HttpMethods.PUT, HttpMethods.POST],
      maxAge: 3000
    }
  }

  constructor (props: AssetsBucketConstructProps) {
    const { scope, config } = props
    super(scope, `${scope.prefix}-assets-bucket`)

    this.bucketId = `${scope.prefix}-assets-bucket`
    this.bucket = new Bucket(this, this.bucketId, {
      bucketName: this.bucketId,

      versioned: config.assetsBucket.versioned,
      encryption: config.assetsBucket.encryption,

      blockPublicAccess: config.assetsBucket.blockPublicAccess,
      objectOwnership: config.assetsBucket.objectOwnership,

      cors: [{
        ...this.internalConfig.cors,
        allowedOrigins: [`https://${config.appDomain}`]
      }],
      lifecycleRules: config.assetsBucket.lifecycleRules,

      removalPolicy: config.assetsBucket.removalPolicy
    })
  }
}