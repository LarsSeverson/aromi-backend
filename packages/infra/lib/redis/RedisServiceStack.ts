import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { InfraStack } from '../InfraStack.js'
import type { RedisServiceStackProps } from './types.js'
import { FargatePlatformVersion, FargateService } from 'aws-cdk-lib/aws-ecs'

export class RedisServiceStack extends InfraStack {
  static readonly DESIRED_COUNT = 1
  static readonly PLATFORM_VERSION = FargatePlatformVersion.LATEST

  static readonly MIN_HEALTHY_PERCENT = 100
  static readonly MAX_HEALTHY_PERCENT = 200

  static readonly ASSIGN_PUBLIC_IP = false
  static readonly ALLOW_ALL_OUTBOUND = true

  static readonly PORT_MAPPING_NAME = 'redis'
  static readonly DNS_NAME = 'redis'

  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  readonly serviceId: string
  readonly service: FargateService

  constructor (props: RedisServiceStackProps) {
    const { app, network, cluster, task } = props
    super({ app, stackName: 'redis-service' })

    this.securityGroupId = `${this.prefix}-redis-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc: network.vpc,
      allowAllOutbound: RedisServiceStack.ALLOW_ALL_OUTBOUND,
      securityGroupName: this.securityGroupId
    })

    this.serviceId = `${this.prefix}-redis-service`
    this.service = new FargateService(this, this.serviceId, {
      cluster: cluster.cluster,
      taskDefinition: task.task,

      desiredCount: RedisServiceStack.DESIRED_COUNT,
      assignPublicIp: RedisServiceStack.ASSIGN_PUBLIC_IP,

      securityGroups: [this.securityGroup],
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS
      },

      platformVersion: RedisServiceStack.PLATFORM_VERSION,

      minHealthyPercent: RedisServiceStack.MIN_HEALTHY_PERCENT,
      maxHealthyPercent: RedisServiceStack.MAX_HEALTHY_PERCENT
    })
  }
}