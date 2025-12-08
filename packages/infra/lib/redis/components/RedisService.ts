import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import { FargateService } from 'aws-cdk-lib/aws-ecs'
import type { RedisServiceComponentProps } from '../types.js'
import { RedisConfig } from './RedisConfig.js'

export class RedisServiceComponent {
  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  readonly serviceId: string
  readonly service: FargateService

  readonly redisDns: string
  readonly redisUrl: string

  constructor (props: RedisServiceComponentProps) {
    const { stack, network, cluster, taskComponent } = props

    this.securityGroupId = `${stack.prefix}-redis-sg`
    this.securityGroup = new SecurityGroup(stack, this.securityGroupId, {
      vpc: network.vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: RedisConfig.SERVICE_CONFIG.allowAllOutbound
    })

    this.serviceId = `${stack.prefix}-redis-service`
    this.service = new FargateService(stack, this.serviceId, {
      cluster: cluster.cluster,
      taskDefinition: taskComponent.task,

      desiredCount: RedisConfig.SERVICE_CONFIG.desiredCount,
      minHealthyPercent: RedisConfig.SERVICE_CONFIG.minHealthPercent,
      maxHealthyPercent: RedisConfig.SERVICE_CONFIG.maxHealthPercent,

      assignPublicIp: RedisConfig.SERVICE_CONFIG.assignPublicIp,

      securityGroups: [this.securityGroup],
      vpcSubnets: {
        subnetType: RedisConfig.SERVICE_CONFIG.subnetType
      }
    })

    this.service.enableCloudMap({
      name: RedisConfig.SERVICE_CONFIG.cloudMapName,
      dnsTtl: RedisConfig.SERVICE_CONFIG.cloudMapDnsTtl
    })

    this.redisDns = cluster.dns(RedisConfig.SERVICE_CONFIG.cloudMapName)
    this.redisUrl = `${this.redisDns}:${RedisConfig.CONTAINER_CONFIG.containerPort}`
  }
}