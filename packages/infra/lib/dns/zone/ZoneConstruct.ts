import { Construct } from 'constructs'
import type { ZoneConstructProps } from '../types.js'
import { HostedZone, type IHostedZone } from 'aws-cdk-lib/aws-route53'

export class ZoneConstruct extends Construct {
  readonly hostedZone: IHostedZone
  readonly hostedZoneId: string

  constructor (props: ZoneConstructProps) {
    const { scope, config } = props
    super(scope, `${scope.prefix}-zone`)

    this.hostedZoneId = `${scope.prefix}-hosted-zone`
    this.hostedZone = new HostedZone(this, this.hostedZoneId, {
      zoneName: config.dns.zoneName
    })
  }
}