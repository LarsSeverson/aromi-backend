import { BlockPublicAccess, Bucket, BucketEncryption, HttpMethods, ObjectOwnership, StorageClass } from 'aws-cdk-lib/aws-s3'
import { InfraStack } from './InfraStack.js'
import type { StorageStackProps } from './types.js'
import { Duration, RemovalPolicy } from 'aws-cdk-lib'
import { AnyPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

export class StorageStack extends InfraStack {
  static readonly VERSIONED = true

  static readonly ENCRYPTION = BucketEncryption.S3_MANAGED

  static readonly PUBLIC_ACCESS = BlockPublicAccess.BLOCK_ALL
  static readonly REMOVAL_POLICY = RemovalPolicy.RETAIN
  static readonly OBJECT_OWNERSHIP = ObjectOwnership.OBJECT_WRITER

  static readonly CORS = [
    {
      allowedOrigins: ['*'],
      allowedHeaders: ['*'],
      allowedMethods: [HttpMethods.GET, HttpMethods.HEAD, HttpMethods.PUT, HttpMethods.POST],
      maxAge: 3000
    }
  ]

  static readonly LIFECYCLE_RULES = [
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

  static readonly FORCE_SSL = true

  readonly bucket: Bucket
  readonly bucketName: string

  constructor (props: StorageStackProps) {
    const { app } = props
    super({ app, stackName: 'storage' })

    this.bucketName = `${this.prefix}-bucket`

    this.bucket = new Bucket(this, this.bucketName, {
      bucketName: this.bucketName,

      versioned: StorageStack.VERSIONED,
      encryption: StorageStack.ENCRYPTION,
      blockPublicAccess: StorageStack.PUBLIC_ACCESS,
      objectOwnership: StorageStack.OBJECT_OWNERSHIP,

      cors: StorageStack.CORS,
      lifecycleRules: StorageStack.LIFECYCLE_RULES,

      removalPolicy: StorageStack.REMOVAL_POLICY
    })

    if (StorageStack.FORCE_SSL) {
      this.bucket.addToResourcePolicy(
        new PolicyStatement({
          actions: ['s3:*'],
          resources: [this.bucket.bucketArn, `${this.bucket.bucketArn}/*`],
          principals: [new AnyPrincipal()],
          effect: Effect.DENY,
          conditions: { Bool: { 'aws:SecureTransport': false } }
        })
      )
    }
  }
}