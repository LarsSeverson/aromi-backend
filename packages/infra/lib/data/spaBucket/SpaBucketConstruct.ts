import { Construct } from 'constructs'
import type { SpaBucketConstructProps } from '../types.js'
import { Bucket } from 'aws-cdk-lib/aws-s3'

export class SpaBucketConstruct extends Construct {
  readonly bucket: Bucket
  readonly bucketId: string

  private readonly internalConfig = {}

  constructor (props: SpaBucketConstructProps) {
    const { scope, config } = props
    super(scope, `${scope.prefix}-spa-bucket`)

    this.bucketId = `${scope.prefix}-spa-bucket`
    this.bucket = new Bucket(this, this.bucketId, {
      bucketName: this.bucketId,

      versioned: config.spaBucket.versioned,
      encryption: config.spaBucket.encryption,

      blockPublicAccess: config.spaBucket.blockPublicAccess,
      objectOwnership: config.spaBucket.objectOwnership,

      lifecycleRules: config.spaBucket.lifecycleRules,

      removalPolicy: config.spaBucket.removalPolicy
    })
  }
}