import { BastionHostLinux, InstanceClass, InstanceSize, InstanceType, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import type { JumpBoxConstructProps } from '../types.js'
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam'

export class JumpBoxConstruct extends Construct {
  readonly securityGroup: SecurityGroup
  readonly securityGroupName: string

  readonly instance: BastionHostLinux
  readonly instanceName: string

  private readonly internalConfig = {
    allowAllOutbound: true,

    subnetType: SubnetType.PRIVATE_WITH_EGRESS,

    instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO)
  }

  constructor (props: JumpBoxConstructProps) {
    const { scope, vpc } = props
    super(scope, `${scope.prefix}-jump-box`)

    this.securityGroupName = `${scope.prefix}-jump-box-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupName, {
      vpc,
      securityGroupName: this.securityGroupName,
      allowAllOutbound: this.internalConfig.allowAllOutbound
    })

    this.instanceName = `${scope.prefix}-jump-box`
    this.instance = new BastionHostLinux(this, this.instanceName, {
      vpc,
      securityGroup: this.securityGroup,
      instanceName: this.instanceName,
      subnetSelection: {
        subnetType: this.internalConfig.subnetType
      },
      instanceType: this.internalConfig.instanceType
    })

    this.instance.role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    )
  }
}