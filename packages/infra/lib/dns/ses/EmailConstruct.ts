import { Construct } from 'constructs'
import type { EmailConstructProps } from '../types.js'
import { ConfigurationSet, EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses'
import { TxtRecord } from 'aws-cdk-lib/aws-route53'
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam'

export class EmailConstruct extends Construct {
  readonly configSet: ConfigurationSet
  readonly configSetName: string

  readonly identity: EmailIdentity
  readonly identityName: string

  readonly txtRecord: TxtRecord

  constructor (props: EmailConstructProps) {
    const { scope, zone, config } = props
    super(scope, `${scope.prefix}-email`)

    this.configSetName = `${scope.prefix}-email-config-set`
    this.configSet = new ConfigurationSet(this, this.configSetName, {
      configurationSetName: this.configSetName
    })

    this.identityName = `${scope.prefix}-email-identity`
    this.identity = new EmailIdentity(this, this.identityName, {
      identity: Identity.publicHostedZone(zone.hostedZone),
      dkimIdentity: config.ses.dkimIdentity,
      mailFromDomain: `mail.${zone.hostedZone.zoneName}`,
      configurationSet: this.configSet
    })

    this.txtRecord = new TxtRecord(this, `${scope.prefix}-email-txt`, {
      zone: zone.hostedZone,
      recordName: '_dmarc',
      values: [
        `v=DMARC1; p=none; rua=mailto:dmarc-reports@${zone.hostedZone.zoneName}`
      ]
    })

    this.identity.grantSendEmail(new ServicePrincipal('cognito-idp.amazonaws.com'))
  }
}