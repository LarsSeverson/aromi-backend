import { Construct } from 'constructs'
import type { DistributionConstructProps } from '../types.js'
import { AllowedMethods, CachedMethods, CachePolicy, Distribution, OriginProtocolPolicy, OriginRequestPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront'
import { HttpOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Fn } from 'aws-cdk-lib'

export class DistributionConstruct extends Construct {
  readonly distribution: Distribution
  readonly distributionId: string

  private readonly internalConfig = {
    defaultBehavior: {
      allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,

      cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
    },

    assetsBehavior: {
      pathPattern: '/assets/*',

      allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
      cachedMethods: CachedMethods.CACHE_GET_HEAD,

      cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
    },

    graphqlBehavior: {
      pathPattern: '/graphql*',

      allowedMethods: AllowedMethods.ALLOW_ALL,
      cachePolicy: CachePolicy.CACHING_DISABLED,
      originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
      protocolPolicy: OriginProtocolPolicy.HTTP_ONLY
    }
  }

  constructor (props: DistributionConstructProps) {
    const {
      scope,
      config,

      spaBucket,
      assetsBucket,

      certifcate,
      webAclId
    } = props

    super(scope, `${scope.prefix}-distribution`)

    const albDnsName = Fn.importValue(config.exportNames.albDnsName)
    const albListenerPort = parseInt(Fn.importValue(config.exportNames.albListenerPort), 10)

    this.distributionId = `${scope.prefix}-distribution`
    this.distribution = new Distribution(this, this.distributionId, {
      domainNames: config.distribution.domainNames,
      certificate: certifcate,
      webAclId,

      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(spaBucket),
        ...this.internalConfig.defaultBehavior
      },

      additionalBehaviors: {
        [this.internalConfig.assetsBehavior.pathPattern]: {
          origin: S3BucketOrigin.withOriginAccessControl(assetsBucket),
          ...this.internalConfig.assetsBehavior
        },

        [this.internalConfig.graphqlBehavior.pathPattern]: {
          origin: new HttpOrigin(
            albDnsName,
            {
              protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
              httpPort: albListenerPort
            }
          ),
          ...this.internalConfig.graphqlBehavior
        }
      }
    })
  }
}