import { FargatePlatformVersion, FargateService } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import type { ServerServiceStackProps } from './types.js'

export class ServerServiceStack extends InfraStack {
  static readonly DESIRED_COUNT = 1
  static readonly PLATFORM_VERSION = FargatePlatformVersion.LATEST

  static readonly ASSIGN_PUBLIC_IP = false
  static readonly ALLOW_ALL_OUTBOUND = true

  readonly serviceId: string
  readonly service: FargateService

  readonly serviceSecurityGroupId: string
  readonly serviceSecurityGroup: SecurityGroup

  constructor (props: ServerServiceStackProps) {
    const { app, network, cluster, task, lb } = props
    super({ app, stackName: 'server-service' })

    this.serviceSecurityGroupId = `${this.prefix}-server-sg`
    this.serviceSecurityGroup = new SecurityGroup(this, this.serviceSecurityGroupId, {
      securityGroupName: this.serviceSecurityGroupId,
      vpc: network.vpc,
      allowAllOutbound: ServerServiceStack.ALLOW_ALL_OUTBOUND
    })

    lb.listener.connections.allowDefaultPortFrom(this.serviceSecurityGroup)

    this.serviceId = `${this.prefix}-server-service`
    this.service = new FargateService(this, this.serviceId, {
      cluster: cluster.cluster,
      taskDefinition: task.task,

      desiredCount: ServerServiceStack.DESIRED_COUNT,
      assignPublicIp: ServerServiceStack.ASSIGN_PUBLIC_IP,

      securityGroups: [this.serviceSecurityGroup],
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS
      },

      platformVersion: ServerServiceStack.PLATFORM_VERSION
    })
  }
}