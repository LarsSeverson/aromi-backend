import { FargateService } from 'aws-cdk-lib/aws-ecs'
import type { RedisServiceComponentProps } from '../types.js'
import { RedisConfig } from './RedisConfig.js'

export class RedisServiceComponent {
  readonly serviceId: string
  readonly service: FargateService

  readonly redisHost: string
  readonly redisPort: number

  constructor (props: RedisServiceComponentProps) {
    const { stack, network, cluster, taskComponent } = props

    this.serviceId = `${stack.prefix}-redis-service`
    this.service = new FargateService(stack, this.serviceId, {
      cluster: cluster.cluster,
      taskDefinition: taskComponent.task,

      desiredCount: RedisConfig.SERVICE_CONFIG.desiredCount,
      minHealthyPercent: RedisConfig.SERVICE_CONFIG.minHealthPercent,
      maxHealthyPercent: RedisConfig.SERVICE_CONFIG.maxHealthPercent,

      assignPublicIp: RedisConfig.SERVICE_CONFIG.assignPublicIp,

      securityGroups: [network.redisSecurityGroup.securityGroup],
      vpcSubnets: {
        subnetType: RedisConfig.SERVICE_CONFIG.subnetType
      },

      serviceConnectConfiguration: {
        namespace: cluster.cluster.defaultCloudMapNamespace!.namespaceName,
        services: [{
          dnsName: RedisConfig.SERVICE_CONFIG.cloudMapName,
          discoveryName: RedisConfig.SERVICE_CONFIG.cloudMapName,
          portMappingName: RedisConfig.CONTAINER_CONFIG.containerName,

          port: RedisConfig.CONTAINER_CONFIG.containerPort
        }]
      }
    })

    this.redisHost = RedisConfig.SERVICE_CONFIG.cloudMapName
    this.redisPort = RedisConfig.CONTAINER_CONFIG.containerPort
  }
}