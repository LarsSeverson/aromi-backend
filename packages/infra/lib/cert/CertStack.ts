import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import { BaseStack } from '../BaseStack.js'
import { CertConfig } from './components/CertConfig.js'
import type { CertStackProps } from './types.js'

export class CertStack extends BaseStack {
  readonly certificate: Certificate
  readonly certificateId: string

  constructor (props: CertStackProps) {
    const { app } = props
    super({
      app,
      stackName: CertConfig.STACK_NAME,
      env: { region: CertConfig.REGION }
    })

    this.certificateId = `${this.prefix}-certificate`
    this.certificate = new Certificate(this, this.certificateId, {
      domainName: CertConfig.DOMAIN_NAME,
      subjectAlternativeNames: CertConfig.ALTERNATE_DOMAIN_NAMES,
      validation: CertConfig.VALIDATION_METHOD
    })
  }
}