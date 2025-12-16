import { Construct } from 'constructs'
import type { WebAclConstructProps } from '../types.js'
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2'

export class WebAclConstruct extends Construct {
  readonly webAcl: CfnWebACL
  readonly webAclId: string

  private readonly internalConfig = {
    scope: 'CLOUDFRONT',

    defaultAction: {
      block: {}
    },

    visibilityConfig: {
      cloudWatchMetricsEnabled: true,
      sampledRequestsEnabled: true,
      metricName: 'webAclMetric'
    },

    rules: [
      {
        name: 'AWSManagedRulesCommonRuleSet',
        priority: 1,
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