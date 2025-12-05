import { FargatePlatformVersion, FargateService } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import type { WorkersServiceStackProps } from './types.js'

export class WorkersServiceStack extends InfraStack {
  static readonly DESIRED_COUNT = 1
  static readonly PLATFORM_VERSION = FargatePlatformVersion.LATEST

  static readonly ASSIGN_PUBLIC_IP = false
  static readonly ALLOW_ALL_OUTBOUND = true

  readonly serviceId: string
  readonly service: FargateService

  readonly serviceSecurityGroupId: string
  readonly serviceSecurityGroup: SecurityGroup

  constructor (props: WorkersServiceStackProps) {
    const { app, network, cluster, task } = props
    super({ app, stackName: 'workers-service' })

    this.serviceSecurityGroupId = `${this.prefix}-workers-sg`
    this.serviceSecurityGroup = new SecurityGroup(this, this.serviceSecurityGroupId, {
      securityGroupName: this.serviceSecurityGroupId,
      vpc: network.vpc,
      allowAllOutbound: WorkersServiceStack.ALLOW_ALL_OUTBOUND
    })

    this.serviceId = `${this.prefix}-workers-service`
    this.service = new FargateService(this, this.serviceId, {
      cluster: cluster.cluster,
      taskDefinition: task.task,

      desiredCount: WorkersServiceStack.DESIRED_COUNT,
      assignPublicIp: WorkersServiceStack.ASSIGN_PUBLIC_IP,

      securityGroups: [this.serviceSecurityGroup],
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS
      },

      platformVersion: WorkersServiceStack.PLATFORM_VERSION
    })
  }
}