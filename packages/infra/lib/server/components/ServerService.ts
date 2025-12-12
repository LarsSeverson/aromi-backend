import { FargateService, ListenerConfig } from 'aws-cdk-lib/aws-ecs'
import type { ServerServiceComponentProps } from '../types.js'
import { ServerConfig } from './ServerConfig.js'
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2'

export class ServerServiceComponent {
  readonly serviceId: string
  readonly service: FargateService

  readonly targetGroupId: string

  constructor (props: ServerServiceComponentProps) {
    const {
      stack,

      network,
      cluster,
      loadBalancer,

      taskComponent
    } = props

    this.serviceId = `${stack.prefix}-server-service`
    this.service = new FargateService(stack, this.serviceId, {
      cluster: cluster.cluster,
      taskDefinition: taskComponent.task,

      desiredCount: ServerConfig.SERVICE_CONFIG.desiredCount,
      minHealthyPercent: ServerConfig.SERVICE_CONFIG.minHealthyPercent,
      maxHealthyPercent: ServerConfig.SERVICE_CONFIG.maxHealthyPercent,

      assignPublicIp: ServerConfig.SERVICE_CONFIG.assignPublicIp,

      securityGroups: [network.serverSecurityGroup.securityGroup],
      vpcSubnets: {
        subnetType: ServerConfig.SERVICE_CONFIG.subnetType
      },

      serviceConnectConfiguration: {
        namespace: cluster.cluster.defaultCloudMapNamespace!.namespaceName
      }
    })

    this.targetGroupId = `${stack.prefix}-server-target-group`
    this.service.registerLoadBalancerTargets({
      containerName: taskComponent.container.containerName,
      containerPort: taskComponent.container.containerPort,

      newTargetGroupId: this.targetGroupId,

      listener: ListenerConfig.applicationListener(
        loadBalancer.serverLoadBalancer.listener,
        {
          protocol: ApplicationProtocol.HTTP,
          healthCheck: ServerConfig.LOAD_BALANCER_CONFIG
        }
      )
    })
  }
}