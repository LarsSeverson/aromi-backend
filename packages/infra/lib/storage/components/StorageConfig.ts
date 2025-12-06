import { BlockPublicAccess, BucketEncryption, HttpMethods, ObjectOwnership, StorageClass } from 'aws-cdk-lib/aws-s3'
import { InfraConfig } from '../../InfraConfig.js'
import { Duration, RemovalPolicy } from 'aws-cdk-lib'

export class StorageConfig extends InfraConfig {
  static readonly S3_CONFIG = {
    VERSIONED: true,

    ENCRYPTION: BucketEncryption.S3_MANAGED,

    PUBLIC_ACCESS: BlockPublicAccess.BLOCK_ALL,
    REMOVAL_POLICY: RemovalPolicy.RETAIN,
    OBJECT_OWNERSHIP: ObjectOwnership.OBJECT_WRITER,

    CORS: [
      {
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
        allowedMethods: [HttpMethods.GET, HttpMethods.HEAD, HttpMethods.PUT, HttpMethods.POST],
        maxAge: 3000
      }
    ],

    LIFECYCLE_RULES: [
      {
        enabled: true,
        transitions: [
          {
            storageClass: StorageClass.INTELLIGENT_TIERING,
            transitionAfter: Duration.days(0)
          }
        ]
      }
    ]
  }
}