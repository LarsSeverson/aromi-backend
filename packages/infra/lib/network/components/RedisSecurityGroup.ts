import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import type { RedisSecurityGroupComponentProps } from '../types.js'

export class RedisSecurityGroupComponent {
  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  constructor (props: RedisSecurityGroupComponentProps) {
    const { stack } = props

    this.securityGroupId = `${stack.prefix}-redis-sg-v1`
    this.securityGroup = new SecurityGroup(stack, this.securityGroupId, {
      vpc: stack.vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: true
    })
  }
}