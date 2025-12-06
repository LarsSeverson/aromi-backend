import { FargatePlatformVersion, FargateService } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import type { ServerServiceStackProps } from './types.js'
import { ApplicationProtocol, type ApplicationTargetGroup } from 'aws-cdk-lib/aws-elasticloadbalancingv2'

export class ServerServiceStack extends InfraStack {
  static readonly DESIRED_COUNT = 1
  static readonly PLATFORM_VERSION = FargatePlatformVersion.LATEST

  static readonly MIN_HEALTHY_PERCENT = 100
  static readonly MAX_HEALTHY_PERCENT = 200

  static readonly ASSIGN_PUBLIC_IP = false
  static readonly ALLOW_ALL_OUTBOUND = true

  readonly serviceId: string
  readonly service: FargateService

  readonly serviceSecurityGroupId: string
  readonly serviceSecurityGroup: SecurityGroup

  readonly targetGroupId: string
  readonly targetGroup: ApplicationTargetGroup

  constructor (props: ServerServiceStackProps) {
    const { app, network, cluster, task, serverLoadBalancer } = props
    super({ app, stackName: 'server-service' })

    this.serviceSecurityGroupId = `${this.prefix}-server-sg`
    this.serviceSecurityGroup = new SecurityGroup(this, this.serviceSecurityGroupId, {
      securityGroupName: this.serviceSecurityGroupId,
      vpc: network.vpc,
      allowAllOutbound: ServerServiceStack.ALLOW_ALL_OUTBOUND
    })

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

      platformVersion: ServerServiceStack.PLATFORM_VERSION,

      minHealthyPercent: ServerServiceStack.MIN_HEALTHY_PERCENT,
      maxHealthyPercent: ServerServiceStack.MAX_HEALTHY_PERCENT
    })

    this.targetGroupId = `${this.prefix}-target-group`
    this.targetGroup = serverLoadBalancer.listener.addTargets(this.targetGroupId, {
      protocol: ApplicationProtocol.HTTP,
      targets: [
        this.service.loadBalancerTarget({
          containerName: task.container.containerName,
          containerPort: task.container.containerPort
        })
      ]
    })
  }
}