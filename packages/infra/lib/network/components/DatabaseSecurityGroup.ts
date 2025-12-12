import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import type { DatabaseSecurityGroupComponentProps } from '../types.js'

export class DatabaseSecurityGroup {
  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  constructor (props: DatabaseSecurityGroupComponentProps) {
    const { stack } = props

    this.securityGroupId = `${stack.prefix}-database-sg`
    this.securityGroup = new SecurityGroup(stack, this.securityGroupId, {
      vpc: stack.vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: true
    })
  }
}