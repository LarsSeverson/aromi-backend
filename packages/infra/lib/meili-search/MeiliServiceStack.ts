import { FargatePlatformVersion, FargateService } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { MeiliServiceStackProps } from './types.js'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'

export class MeiliServiceStack extends InfraStack {
  static readonly DESIRED_COUNT = 1
  static readonly PLATFORM_VERSION = FargatePlatformVersion.LATEST

  static readonly ASSIGN_PUBLIC_IP = false
  static readonly ALLOW_ALL_OUTBOUND = true

  readonly serviceId: string
  readonly service: FargateService

  readonly serviceSecurityGroupId: string
  readonly serviceSecurityGroup: SecurityGroup

  constructor (props: MeiliServiceStackProps) {
    const { app, network, storage, cluster, task } = props
    super({ app, stackName: 'meili-service' })

    this.serviceSecurityGroupId = `${this.prefix}-meili-sg`
    this.serviceSecurityGroup = new SecurityGroup(this, this.serviceSecurityGroupId, {
      securityGroupName: this.serviceSecurityGroupId,
      vpc: network.vpc,
      allowAllOutbound: MeiliServiceStack.ALLOW_ALL_OUTBOUND
    })

    storage.securityGroup.connections.allowDefaultPortFrom(this.serviceSecurityGroup)

    this.serviceId = `${this.prefix}-meili-service`
    this.service = new FargateService(this, this.serviceId, {
      cluster: cluster.cluster,
      taskDefinition: task.task,

      desiredCount: MeiliServiceStack.DESIRED_COUNT,
      assignPublicIp: MeiliServiceStack.ASSIGN_PUBLIC_IP,

      securityGroups: [this.serviceSecurityGroup],
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS
      },

      platformVersion: MeiliServiceStack.PLATFORM_VERSION
    })
  }
}