import { AllowedMethods, CachedMethods, CachePolicy, OriginRequestPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront'
import { BaseConfig } from '../../BaseConfig.js'

export class CDNConfig extends BaseConfig {
  static readonly ALLOWED_METHODS = AllowedMethods.ALLOW_GET_HEAD
  static readonly CACHED_METHODS = CachedMethods.CACHE_GET_HEAD

  static readonly VIEWER_PROTOCOL_POLICY = ViewerProtocolPolicy.REDIRECT_TO_HTTPS
  static readonly ORIGIN_REQUEST_POLICY = OriginRequestPolicy.CORS_S3_ORIGIN
  static readonly CACHE_POLICY = CachePolicy.CACHING_OPTIMIZED

  static readonly API_BEHAVIOR_PATH = '/graphql'
  static readonly API_ORIGIN_REQUEST_POLICY = OriginRequestPolicy.ALL_VIEWER
}