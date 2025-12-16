import { Construct } from 'constructs'
import type { AcmConstructProps } from '../types.js'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'

export class AcmConstruct extends Construct {
  readonly certifacte: Certificate
  readonly certificateId: string

  constructor (props: AcmConstructProps) {
    const { scope, config } = props
    super(scope, `${scope.prefix}-acm`)

    this.certificateId = `${scope.prefix}-acm-certificate`
    this.certifacte = new Certificate(this, this.certificateId, {
      domainName: config.appDomain,
      validation: config.acm.validation
    })
  }
}