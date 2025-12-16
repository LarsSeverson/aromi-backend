import { Construct } from 'constructs'
import type { RedisServiceConstructProps } from '../types.js'
import { type ContainerDefinition, ContainerImage, FargateService, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'

export class RedisServiceConstruct extends Construct {
  readonly securityGroup: SecurityGroup
  readonly securityGroupId: string

  readonly task: FargateTaskDefinition
  readonly taskId: string

  readonly container: ContainerDefinition
  readonly containerId: string

  readonly service: FargateService
  readonly serviceId: string

  readonly containerName = 'redis'

  readonly serviceHost = 'redis'
  readonly servicePort = 6379

  private readonly internalConfig = {
    security: {
      allowAllOutbound: true,
      subnetType: SubnetType.PRIVATE_WITH_EGRESS
    },

    container: {
      image: ContainerImage.fromRegistry('redis:latest')
    }
  }

  constructor (props: RedisServiceConstructProps) {
    const { scope, config, vpc, cluster } = props
    super(scope, `${scope.prefix}-redis-service`)

    this.securityGroupId = `${scope.prefix}-redis-service-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: this.internalConfig.security.allowAllOutbound
    })

    this.taskId = `${scope.prefix}-redis-service-task`
    this.task = new FargateTaskDefinition(this, this.taskId, {
      cpu: config.redisService.cpu,
      memoryLimitMiB: config.redisService.memoryLimitMiB,
      runtimePlatform: config.redisService.runtimePlatform
    })

    this.containerId = `${scope.prefix}-redis-service-container`
    this.container = this.task.addContainer(this.containerId, {
      image: this.internalConfig.container.image,
      containerName: this.containerName
    })

    this.container.addPortMappings({
      name: this.containerName,
      containerPort: this.servicePort
    })

    this.serviceId = `${scope.prefix}-redis-service`
    this.service = new FargateService(this, this.serviceId, {
      cluster,
      taskDefinition: this.task,

      desiredCount: config.redisService.desiredCount,
      minHealthyPercent: config.redisService.minHealthyPercent,
      maxHealthyPercent: config.redisService.maxHealthyPercent,

      assignPublicIp: config.redisService.assignPublicIp,

      securityGroups: [this.securityGroup],
      vpcSubnets: {
        subnetType: this.internalConfig.security.subnetType
      },

      serviceConnectConfiguration: {
        namespace: cluster.defaultCloudMapNamespace!.namespaceName,
        services: [{
          dnsName: this.serviceHost,
          discoveryName: this.serviceHost,
          portMappingName: this.containerName,

          port: this.servicePort
        }]
      }
    })
  }
}