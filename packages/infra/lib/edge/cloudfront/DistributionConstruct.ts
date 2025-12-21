import { Construct } from 'constructs'
import type { DistributionConstructProps } from '../types.js'
import { AllowedMethods, CachedMethods, CachePolicy, Distribution, Function, FunctionCode, FunctionEventType, OriginProtocolPolicy, OriginRequestPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront'
import { LoadBalancerV2Origin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Bucket, BucketPolicy, type IBucket } from 'aws-cdk-lib/aws-s3'
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { Stack } from 'aws-cdk-lib'

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

    errorResponses: [
      {
        httpStatus: 403,
        responseHttpStatus: 200,
        responsePagePath: '/index.html'
      },
      {
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html'
      }
    ],

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
      webAclId,

      alb
    } = props

    super(scope, `${scope.prefix}-distribution`)

    const importedSpaBucket = Bucket.fromBucketAttributes(scope, 'AvoidCDKBug31462SPA', {
      bucketArn: spaBucket.bucketArn,
      region: Stack.of(spaBucket).region
    })

    const importedAssetsBucket = Bucket.fromBucketAttributes(scope, 'AvoidCDKBug31462Assets', {
      bucketArn: assetsBucket.bucketArn,
      region: Stack.of(spaBucket).region
    })

    this.distributionId = `${scope.prefix}-distribution`
    this.distribution = new Distribution(this, this.distributionId, {
      domainNames: config.distribution.domainNames,
      certificate: certifcate,
      webAclId,

      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(importedSpaBucket, {
          originId: 'spa'
        }),
        ...this.internalConfig.defaultBehavior
      },

      errorResponses: this.internalConfig.errorResponses,

      additionalBehaviors: {
        [this.internalConfig.assetsBehavior.pathPattern]: {
          origin: S3BucketOrigin.withOriginAccessControl(importedAssetsBucket, {
            originId: 'assets'
          }),

          functionAssociations: [{
            function: this.createRewriteFunction(),
            eventType: FunctionEventType.VIEWER_REQUEST
          }],

          ...this.internalConfig.assetsBehavior
        },

        [this.internalConfig.graphqlBehavior.pathPattern]: {
          origin: new LoadBalancerV2Origin(alb.loadBalancer, {
            originId: 'alb',
            protocolPolicy: this.internalConfig.graphqlBehavior.protocolPolicy,
            httpPort: alb.listener.port
          }),
          ...this.internalConfig.graphqlBehavior
        }
      }
    })

    this.createCloudFrontS3Policy(importedSpaBucket, this.distribution)
    this.createCloudFrontS3Policy(importedAssetsBucket, this.distribution)
  }

  private createRewriteFunction (): Function {
    return new Function(this, 'AssetsRewriteFunction', {
      code: FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var uri = request.uri;
          if (uri.startsWith('/assets/')) {
            request.uri = uri.replace('/assets/', '/');
          }
          return request;
        }
      `)
    })
  }

  private createCloudFrontS3Policy (bucket: IBucket, distribution: Distribution): BucketPolicy {
    const policy = new BucketPolicy(this, `${bucket.node.id}Policy`, {
      bucket
    })

    policy.document.addStatements(
      new PolicyStatement({
        sid: 'AllowCloudFrontServicePrincipalReadOnly',
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [bucket.arnForObjects('*')],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${Stack.of(this).account}:distribution/${distribution.distributionId}`
          }
        }
      })
    )

    return policy
  }
}