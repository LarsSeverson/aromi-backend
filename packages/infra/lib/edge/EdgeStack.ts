import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { BaseStack } from '../../common/BaseStack.js'
import { AcmConstruct } from './acm/AcmConstruct.js'
import { DistributionConstruct } from './cloudfront/DistributionConstruct.js'
import type { EdgeStackProps } from './types.js'
import { WebAclConstruct } from './waf/WebAclConstruct.js'
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'

export class EdgeStack extends BaseStack {
  readonly appDistribution: DistributionConstruct
  readonly acm: AcmConstruct
  readonly acl: WebAclConstruct

  readonly rootAlias: ARecord
  readonly wwwAlias: ARecord

  constructor (props: EdgeStackProps) {
    const {
      scope, config,

      dnsStack,
      dataStack,
      applicationStack
    } = props

    super({
      scope,
      stackName: 'edge',
      config,

      crossRegionReferences: true,
      env: { region: 'us-east-1' }
    })

    this.acm = new AcmConstruct({
      scope: this,
      config: this.config,
      zone: dnsStack.zone
    })

    this.acl = new WebAclConstruct({
      scope: this,
      config: this.config
    })

    this.appDistribution = new DistributionConstruct({
      scope: this,
      config: this.config,

      spaBucket: dataStack.spaBucket.bucket,
      assetsBucket: dataStack.assetsBucket.bucket,

      certifcate: this.acm.certifacte,
      webAclId: this.acl.webAcl.attrArn,

      alb: applicationStack.alb
    })

    this.rootAlias = new ARecord(this, `${this.prefix}-root-alias`, {
      zone: dnsStack.zone.hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.appDistribution.distribution))
    })

    this.wwwAlias = new ARecord(this, `${this.prefix}-www-alias`, {
      zone: dnsStack.zone.hostedZone,
      recordName: 'www',
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.appDistribution.distribution))
    })
  }
}