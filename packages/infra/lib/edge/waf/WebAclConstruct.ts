import { Construct } from 'constructs'
import type { WebAclConstructProps } from '../types.js'
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2'

export class WebAclConstruct extends Construct {
  readonly webAcl: CfnWebACL
  readonly webAclId: string

  private readonly internalConfig = {
    scope: 'CLOUDFRONT',

    defaultAction: {
      allow: {}
    },

    visibilityConfig: {
      cloudWatchMetricsEnabled: true,
      sampledRequestsEnabled: true,
      metricName: 'webAclMetric'
    },

    rules: [
      {
        name: 'AmazonIPReputation',
        priority: 0,
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesAmazonIpReputationList'
          }
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          sampledRequestsEnabled: true,
          metricName: 'ipRepMetric'
        }
      },

      {
        name: 'RelaxedRateLimit',
        priority: 1,
        action: { captcha: {} },
        statement: {
          rateBasedStatement: {
            limit: 3000,
            aggregateKeyType: 'IP',
            scopeDownStatement: {
              byteMatchStatement: {
                searchString: '/graphql',
                fieldToMatch: { uriPath: {} },
                positionalConstraint: 'STARTS_WITH',
                textTransformations: [{ priority: 0, type: 'NONE' }]
              }
            }
          }
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          sampledRequestsEnabled: true,
          metricName: 'RelaxedRateLimitMetric'
        }
      },

      {
        name: 'AWSManagedRulesCommonRuleSet',
        priority: 2,
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesCommonRuleSet'
          }
        },

        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          sampledRequestsEnabled: true,
          metricName: 'commonRules'
        }
      }
    ]
  }

  constructor (props: WebAclConstructProps) {
    const { scope } = props
    super(scope, `${scope.prefix}-waf-web-acl`)

    this.webAclId = `${scope.prefix}-waf-web-acl`
    this.webAcl = new CfnWebACL(this, this.webAclId, {
      name: this.webAclId,
      scope: this.internalConfig.scope,

      defaultAction: this.internalConfig.defaultAction,
      visibilityConfig: this.internalConfig.visibilityConfig,
      rules: this.internalConfig.rules
    })
  }
}