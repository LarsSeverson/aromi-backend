import { AllowedMethods, CachedMethods, CachePolicy, Distribution, OriginRequestPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront'
import { InfraStack } from '../InfraStack.js'
import type { CDNStackProps } from './types.js'
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'

export class CDNStack extends InfraStack {
  static readonly ALLOWED_METHODS = AllowedMethods.ALLOW_GET_HEAD

  static readonly CACHED_METHODS = CachedMethods.CACHE_GET_HEAD

  static readonly VIEWER_PROTOCOL_POLICY = ViewerProtocolPolicy.REDIRECT_TO_HTTPS

  static readonly ORIGIN_REQUEST_POLICY = OriginRequestPolicy.CORS_S3_ORIGIN

  static readonly CACHE_POLICY = CachePolicy.CACHING_OPTIMIZED

  readonly distributionId: string
  readonly distribution: Distribution
  readonly domainName: string

  constructor (props: CDNStackProps) {
    const { app, storage } = props
    super({ app, stackName: 'cdn' })

    this.distributionId = `${this.prefix}-distribution`
    this.distribution = new Distribution(this, this.distributionId, {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(storage.bucket),

        allowedMethods: CDNStack.ALLOWED_METHODS,
        cachedMethods: CDNStack.CACHED_METHODS,

        viewerProtocolPolicy: CDNStack.VIEWER_PROTOCOL_POLICY,

        originRequestPolicy: CDNStack.ORIGIN_REQUEST_POLICY,
        cachePolicy: CDNStack.CACHE_POLICY
      }
    })

    this.domainName = this.distribution.distributionDomainName
  }
}