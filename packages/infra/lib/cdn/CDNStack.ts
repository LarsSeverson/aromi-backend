import { AllowedMethods, CachePolicy, Distribution, OriginProtocolPolicy, OriginRequestPolicy } from 'aws-cdk-lib/aws-cloudfront'
import { BaseStack } from '../BaseStack.js'
import type { CDNStackProps } from './types.js'
import { LoadBalancerV2Origin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { CDNConfig } from './components/CDNConfig.js'
import { Bucket } from 'aws-cdk-lib/aws-s3'

export class CDNStack extends BaseStack {
  readonly distributionId: string
  readonly distribution: Distribution

  readonly domainName: string

  constructor (props: CDNStackProps) {
    const { app, storage, loadBalancer } = props
    super({ app, stackName: 'cdn' })

    // WORKAROUND: re-import bucket to avoid CDK OAC cross-stack circular dependency
    const importedBucket = Bucket.fromBucketArn(this, 'AvoidCDKBug31462', storage.bucket.bucketArn)

    this.distributionId = `${this.prefix}-distribution`
    this.distribution = new Distribution(this, this.distributionId, {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(importedBucket),

        allowedMethods: CDNConfig.ALLOWED_METHODS,
        cachedMethods: CDNConfig.CACHED_METHODS,

        viewerProtocolPolicy: CDNConfig.VIEWER_PROTOCOL_POLICY,

        originRequestPolicy: CDNConfig.ORIGIN_REQUEST_POLICY,
        cachePolicy: CDNConfig.CACHE_POLICY
      }
    })

    this.distribution.addBehavior(
      CDNConfig.API_BEHAVIOR_PATH,
      new LoadBalancerV2Origin(
        loadBalancer.serverLoadBalancer.loadBalancer,
        {
          protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
          httpPort: loadBalancer.serverLoadBalancer.listener.port
        }
      ),
      {
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER
      }
    )

    this.domainName = this.distribution.distributionDomainName
  }
}