import { Construct } from 'constructs'
import type { AcmConstructProps } from '../../edge/types.js'
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager'

export class AcmConstruct extends Construct {
  readonly certifacte: Certificate
  readonly certificateId: string

  constructor (props: AcmConstructProps) {
    const { scope, config, zone } = props
    super(scope, `${scope.prefix}-acm`)

    this.certificateId = `${scope.prefix}-acm-certificate`
    this.certifacte = new Certificate(this, this.certificateId, {
      domainName: config.appDomain,
      subjectAlternativeNames: config.acm.subjectAlternativeNames,
      validation: CertificateValidation.fromDns(zone.hostedZone)
    })
  }
}