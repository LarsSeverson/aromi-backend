import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import type { ServerLoadBalancerSecurityGroupComponentProps } from '../types.js'

export class ServerLoadBalancerSecurityGroupComponent {
  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  constructor (props: ServerLoadBalancerSecurityGroupComponentProps) {
    const { stack } = props

    this.securityGroupId = `${stack.prefix}-server-alb-sg`
    this.securityGroup = new SecurityGroup(stack, this.securityGroupId, {
      vpc: stack.vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: true
    })
  }
}