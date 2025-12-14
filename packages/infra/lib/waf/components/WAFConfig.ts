import { BaseConfig } from '../../BaseConfig.js'

export class WAFConfig extends BaseConfig {
  static readonly STACK_NAME = 'waf'
  static readonly REGION = 'us-east-1'
  static readonly SCOPE = 'CLOUDFRONT'

  static readonly DEFAULT_ACTION = {
    block: {}
  }

  static readonly DEFAULT_VISIBILITY_CONFIG = {
    sampledRequestsEnabled: true,
    cloudWatchMetricsEnabled: true,
    metricName: `${BaseConfig.prefix}-waf`
  }

  static readonly ORIGIN_ALLOW_RULE = {
    priority: 0,
    positionalConstraint: 'EXACTLY',
    textTransformPriority: 0
  }

  static readonly METRICS = {
    common: `${BaseConfig.prefix}-common`,
    originVerify: `${BaseConfig.prefix}-origin-verify`
  }
}
