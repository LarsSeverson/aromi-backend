import { BaseConfig } from '../../BaseConfig.js'

export class NetworkConfig extends BaseConfig {
  static readonly CDN_PREFIX_LIST_ID = 'CloudFrontOriginFacing'
  static readonly CDN_PREFIX_LIST_NAME = 'com.amazonaws.global.cloudfront.origin-facing'

  static readonly CDN_PREFIX_LIST_ID_IPV6 = 'CloudFrontOriginFacingIPv6'
  static readonly CDN_PREFIX_LIST_NAME_IPV6 = 'com.amazonaws.global.ipv6.cloudfront.origin-facing'
}