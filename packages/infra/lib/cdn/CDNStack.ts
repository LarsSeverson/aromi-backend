import { AllowedMethods, CachedMethods, CachePolicy, Distribution, OriginRequestPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront'
import { InfraStack } from '../InfraStack.js'
import type { CDNStackProps } from './types.js'
import { LoadBalancerV2Origin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { BlockPublicAccess, Bucket, BucketEncryption, HttpMethods, ObjectOwnership, StorageClass } from 'aws-cdk-lib/aws-s3'
import { Duration, RemovalPolicy } from 'aws-cdk-lib'

export class CDNStack extends InfraStack {
  static readonly ALLOWED_METHODS = AllowedMethods.ALLOW_GET_HEAD
  static readonly CACHED_METHODS = CachedMethods.CACHE_GET_HEAD

  static readonly VIEWER_PROTOCOL_POLICY = ViewerProtocolPolicy.REDIRECT_TO_HTTPS
  static readonly ORIGIN_REQUEST_POLICY = OriginRequestPolicy.CORS_S3_ORIGIN
  static readonly CACHE_POLICY = CachePolicy.CACHING_OPTIMIZED

  static readonly BUCKET_CONFIG = {
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

  static readonly API_BEHAVIOR_PATH = '/api/*'

  readonly bucketId: string
  readonly bucket: Bucket

  readonly distributionId: string
  readonly distribution: Distribution

  readonly domainName: string

  constructor (props: CDNStackProps) {
    const { app, serverLB } = props
    super({ app, stackName: 'cdn' })

    this.bucketId = `${this.prefix}-bucket`
    this.bucket = new Bucket(this, this.bucketId, {
      bucketName: this.bucketId,

      versioned: CDNStack.BUCKET_CONFIG.VERSIONED,
      encryption: CDNStack.BUCKET_CONFIG.ENCRYPTION,

      blockPublicAccess: CDNStack.BUCKET_CONFIG.PUBLIC_ACCESS,
      objectOwnership: CDNStack.BUCKET_CONFIG.OBJECT_OWNERSHIP,

      cors: CDNStack.BUCKET_CONFIG.CORS,
      lifecycleRules: CDNStack.BUCKET_CONFIG.LIFECYCLE_RULES,

      removalPolicy: CDNStack.BUCKET_CONFIG.REMOVAL_POLICY
    })

    this.distributionId = `${this.prefix}-distribution`
    this.distribution = new Distribution(this, this.distributionId, {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(this.bucket),

        allowedMethods: CDNStack.ALLOWED_METHODS,
        cachedMethods: CDNStack.CACHED_METHODS,

        viewerProtocolPolicy: CDNStack.VIEWER_PROTOCOL_POLICY,

        originRequestPolicy: CDNStack.ORIGIN_REQUEST_POLICY,
        cachePolicy: CDNStack.CACHE_POLICY
      }
    })

    this.distribution.addBehavior(
      CDNStack.API_BEHAVIOR_PATH,
      new LoadBalancerV2Origin(serverLB.loadBalancer),
      {
        allowedMethods: AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_DISABLED
      }
    )

    this.domainName = this.distribution.distributionDomainName
  }
}