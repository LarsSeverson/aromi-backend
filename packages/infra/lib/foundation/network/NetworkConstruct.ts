import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import type { BaseConstructProps } from 'packages/infra/common/types.js'

export class NetworkConstruct extends Construct {
  readonly vpc: Vpc
  readonly vpcId: string

  constructor (props: BaseConstructProps) {
    const { scope, config } = props
    super(scope, `${scope.prefix}-network`)

    this.vpcId = `${scope.prefix}-vpc`
    this.vpc = new Vpc(this, this.vpcId, {
      vpcName: this.vpcId,

      maxAzs: config.network.maxAzs,
      natGateways: config.network.natGateways,
      subnetConfiguration: config.network.subnetConfiguration
    })
  }
}