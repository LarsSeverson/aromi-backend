import { Construct } from 'constructs'
import type { EmailConstructProps } from '../types.js'
import { EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses'

export class EmailConstruct extends Construct {
  readonly identity: EmailIdentity
  readonly identityName: string

  constructor (props: EmailConstructProps) {
    const { scope, zone, config } = props
    super(scope, `${scope.prefix}-email`)

    this.identityName = `${scope.prefix}-email-identity`
    this.identity = new EmailIdentity(this, this.identityName, {
      identity: Identity.publicHostedZone(zone.hostedZone),
      dkimIdentity: config.ses.dkimIdentity,
      mailFromDomain: `mail.${zone.hostedZone.zoneName}`
    })
  }
}