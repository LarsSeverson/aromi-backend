import { SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import { FargateService } from 'aws-cdk-lib/aws-ecs'
import type { MeiliServiceComponentProps } from '../types.js'
import { MeiliConfig } from './MeiliConfig.js'

export class MeiliServiceComponent {
  readonly securityGroupId: string
  readonly securityGroup: SecurityGroup

  readonly serviceId: string
  readonly service: FargateService

  readonly meiliDns: string
  readonly meiliUrl: string

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
      }
    })

    this.service.enableCloudMap({
      name: MeiliConfig.SERVICE_CONFIG.cloudMapName,
      dnsTtl: MeiliConfig.SERVICE_CONFIG.cloudMapDnsTtl
    })

    this.meiliDns = cluster.dns(MeiliConfig.SERVICE_CONFIG.cloudMapName)
    this.meiliUrl = `${this.meiliDns}:${MeiliConfig.CONTAINER_CONFIG.containerPort}`
  }
}