import { FargateService } from 'aws-cdk-lib/aws-ecs'
import type { MeiliServiceComponentProps } from '../types.js'
import { MeiliConfig } from './MeiliConfig.js'

export class MeiliServiceComponent {
  readonly serviceId: string
  readonly service: FargateService

  readonly meiliHost: string
  readonly meiliPort: number

  constructor (props: MeiliServiceComponentProps) {
    const { stack, network, cluster, taskComponent } = props

    this.serviceId = `${MeiliConfig.prefix}-meili-service`
    this.service = new FargateService(stack, this.serviceId, {
      cluster: cluster.cluster,
      taskDefinition: taskComponent.task,

      desiredCount: MeiliConfig.SERVICE_CONFIG.desiredCount,
      minHealthyPercent: MeiliConfig.SERVICE_CONFIG.minHealthPercent,
      maxHealthyPercent: MeiliConfig.SERVICE_CONFIG.maxHealthPercent,

      assignPublicIp: MeiliConfig.SERVICE_CONFIG.assignPublicIp,

      securityGroups: [network.meiliSecurityGroup.serviceSecurityGroup],
      vpcSubnets: {
        subnetType: MeiliConfig.SERVICE_CONFIG.subnetType
      },

      serviceConnectConfiguration: {
        namespace: cluster.cluster.defaultCloudMapNamespace!.namespaceName,
        services: [{
          portMappingName: MeiliConfig.CONTAINER_CONFIG.containerName,
          dnsName: MeiliConfig.SERVICE_CONFIG.cloudMapName,
          port: MeiliConfig.CONTAINER_CONFIG.containerPort
        }]
      }
    })

    this.meiliHost = `${MeiliConfig.SERVICE_CONFIG.cloudMapName}:${MeiliConfig.CONTAINER_CONFIG.containerPort}`
    this.meiliPort = MeiliConfig.CONTAINER_CONFIG.containerPort
  }
}