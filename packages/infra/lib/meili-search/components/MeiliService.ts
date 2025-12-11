import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import { FargateService } from 'aws-cdk-lib/aws-ecs'
import type { MeiliServiceComponentProps } from '../types.js'
import { MeiliConfig } from './MeiliConfig.js'

export class MeiliServiceComponent {
  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  readonly serviceId: string
  readonly service: FargateService

  readonly meiliHost: string
  readonly meiliPort: number

  constructor (props: MeiliServiceComponentProps) {
    const { stack, network, cluster, taskComponent } = props

    this.securityGroupId = `${MeiliConfig.prefix}-meili-service-sg`
    this.securityGroup = new SecurityGroup(stack, this.securityGroupId, {
      vpc: network.vpc,
      allowAllOutbound: MeiliConfig.SERVICE_CONFIG.allowAllOutbound
    })

    this.serviceId = `${MeiliConfig.prefix}-meili-service`
    this.service = new FargateService(stack, this.serviceId, {
      cluster: cluster.cluster,
      taskDefinition: taskComponent.task,

      desiredCount: MeiliConfig.SERVICE_CONFIG.desiredCount,
      minHealthyPercent: MeiliConfig.SERVICE_CONFIG.minHealthPercent,
      maxHealthyPercent: MeiliConfig.SERVICE_CONFIG.maxHealthPercent,

      assignPublicIp: MeiliConfig.SERVICE_CONFIG.assignPublicIp,

      securityGroups: [this.securityGroup],
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

    this.meiliHost = MeiliConfig.SERVICE_CONFIG.cloudMapName
    this.meiliPort = MeiliConfig.CONTAINER_CONFIG.containerPort
  }
}