import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import type { MeiliSecurityGroupComponentProps } from '../types.js'

export class MeiliSecurityGroupComponent {
  readonly efsSecurityGroupId: string
  readonly efsSecurityGroup: SecurityGroup

  readonly serviceSecurityGroupId: string
  readonly serviceSecurityGroup: SecurityGroup

  constructor (props: MeiliSecurityGroupComponentProps) {
    const { stack } = props

    this.efsSecurityGroupId = `${stack.prefix}-meili-efs-sg`
    this.efsSecurityGroup = new SecurityGroup(stack, this.efsSecurityGroupId, {
      vpc: stack.vpc,
      securityGroupName: this.efsSecurityGroupId,
      allowAllOutbound: true
    })

    this.serviceSecurityGroupId = `${stack.prefix}-meili-service-sg`
    this.serviceSecurityGroup = new SecurityGroup(stack, this.serviceSecurityGroupId, {
      vpc: stack.vpc,
      securityGroupName: this.serviceSecurityGroupId,
      allowAllOutbound: true
    })
  }
}