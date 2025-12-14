import { CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager'

export class CertConfig {
  static readonly STACK_NAME = 'cert'
  static readonly REGION = 'us-east-1'

  static readonly DOMAIN_NAME = 'aromi.net'
  static readonly ALTERNATE_DOMAIN_NAMES = ['www.aromi.net']
  static readonly VALIDATION_METHOD = CertificateValidation.fromDns()
}