import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2'
import type { NetworkStackProps } from './types.js'
import { InfraStack } from './InfraStack.js'

export class NetworkStack extends InfraStack {
  vpc: Vpc

  constructor (props: NetworkStackProps) {
    super(props)

    const vpcId = `${this.prefix}-vpc`

    this.vpc = new Vpc(this, vpcId, {
      maxAzs: 2,

      subnetConfiguration: [
        {
          name: `${this.prefix}-public`,
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: `${this.prefix}-private`,
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24
        }
      ],

      natGateways: 1
    })
  }
}