import { Construct } from 'constructs'
import type { EmailConstructProps } from '../types.js'
import { ConfigurationSet, EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses'
import { MxRecord, TxtRecord } from 'aws-cdk-lib/aws-route53'
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { Alarm, ComparisonOperator, Metric } from 'aws-cdk-lib/aws-cloudwatch'
import { Duration } from 'aws-cdk-lib'

export class EmailConstruct extends Construct {
  readonly configSet: ConfigurationSet
  readonly configSetName: string

  readonly identity: EmailIdentity
  readonly identityName: string

  readonly dkimRecord: TxtRecord
  readonly spfRecord: TxtRecord

  readonly bounceAlarm?: Alarm
  readonly complaintAlarm?: Alarm

  readonly googMxRecord: MxRecord

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

    this.dkimRecord = new TxtRecord(this, `${scope.prefix}-email-txt`, {
      zone: zone.hostedZone,
      recordName: '_dmarc',
      values: [
        `v=DMARC1; p=none; rua=mailto:admin@${zone.hostedZone.zoneName}`
      ]
    })

    this.spfRecord = new TxtRecord(this, `${scope.prefix}-email-spf`, {
      zone: zone.hostedZone,
      recordName: `mail.${zone.hostedZone.zoneName}`,
      values: [
        'v=spf1 include:_spf.google.com include:amazonses.com ~all'
      ]
    })

    this.identity.grantSendEmail(new ServicePrincipal('cognito-idp.amazonaws.com'))

    if (config.ses.enableAlarms ?? false) {
      this.bounceAlarm = new Alarm(this, `${scope.prefix}-email-bounce-alarm`, {
        alarmName: `${scope.prefix}-email-bounce-alarm`,
        metric: new Metric({
          namespace: 'AWS/SES',
          metricName: 'Reputation.BounceRate',
          statistic: 'Average',
          period: Duration.minutes(15)
        }),
        threshold: 0.05, // 5%
        evaluationPeriods: 1,
        comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        alarmDescription: 'Alert: SES Bounce Rate has reached 5%.'
      })

      this.complaintAlarm = new Alarm(this, `${scope.prefix}-email-complaint-alarm`, {
        alarmName: `${scope.prefix}-email-complaint-alarm`,
        metric: new Metric({
          namespace: 'AWS/SES',
          metricName: 'Reputation.ComplaintRate',
          statistic: 'Average',
          period: Duration.minutes(15)
        }),
        threshold: 0.001, // 0.1%
        evaluationPeriods: 1,
        comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        alarmDescription: 'Alert: SES Complaint Rate has reached 0.1%.'
      })
    }

    this.googMxRecord = new MxRecord(this, `${scope.prefix}-google-mx`, {
      zone: zone.hostedZone,
      values: [
        { priority: 1, hostName: 'smtp.google.com' }
      ]
    })
  }
}