import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2'
import type { NetworkStackProps } from './types.js'
import { InfraStack } from '../InfraStack.js'

export class NetworkStack extends InfraStack {
  static readonly MAX_AZS = 2
  static readonly PUBLIC_MASK = 24
  static readonly PRIVATE_MASK = 24
  static readonly NAT_GATEWAYS = 1

  readonly vpc: Vpc
  readonly vpcId: string

  constructor (props: NetworkStackProps) {
    const { app } = props

    super({ app, stackName: 'network' })

    this.vpcId = `${this.prefix}-vpc`
    this.vpc = new Vpc(this, this.vpcId, {
      maxAzs: NetworkStack.MAX_AZS,

      subnetConfiguration: [
        {
          name: `${this.stackName}-public`,
          subnetType: SubnetType.PUBLIC,
          cidrMask: NetworkStack.PUBLIC_MASK
        },
        {
          name: `${this.stackName}-private`,
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: NetworkStack.PRIVATE_MASK
        }
      ],

      natGateways: NetworkStack.NAT_GATEWAYS
    })
  }
}