import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2'
import { BaseStack } from '../BaseStack.js'
import { WAFConfig } from './components/WAFConfig.js'
import type { WAFStackProps } from './types.js'

export class WAFStack extends BaseStack {
  readonly webAcl: CfnWebACL

  constructor (props: WAFStackProps) {
    super({
      app: props.app,
      stackName: WAFConfig.STACK_NAME,
      env: { region: WAFConfig.REGION }
    })

    this.webAcl = new CfnWebACL(this, 'WebAcl', {
      name: `${this.prefix}-cdn-waf`,
      scope: WAFConfig.SCOPE,
      defaultAction: WAFConfig.DEFAULT_ACTION,
      visibilityConfig: WAFConfig.DEFAULT_VISIBILITY_CONFIG,
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
            metricName: 'commonRules',
            sampledRequestsEnabled: true
          }
        }
      ]
    })
  }
}
