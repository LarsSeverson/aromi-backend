import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import type { ServerSecurityGroupComponentProps } from '../types.js'

export class ServerSecurityGroupComponent {
  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  constructor (props: ServerSecurityGroupComponentProps) {
    const { stack } = props

    this.securityGroupId = `${stack.prefix}-server-sg`
    this.securityGroup = new SecurityGroup(stack, this.securityGroupId, {
      vpc: stack.vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: true
    })
  }
}