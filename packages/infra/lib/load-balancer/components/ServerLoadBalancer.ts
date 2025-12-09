import { type ApplicationListener, ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import type { ServerLoadBalancerComponentProps } from '../types.js'
import { LoadBalancerConfig } from './LoadBalancerConfig.js'

export class ServerLoadBalancerComponent {
  readonly loadBalancerId: string
  readonly loadBalancer: ApplicationLoadBalancer

  readonly listenerId: string
  readonly listener: ApplicationListener

  constructor (props: ServerLoadBalancerComponentProps) {
    const { stack, network } = props

    this.loadBalancerId = `${stack.prefix}-server-alb`
    this.loadBalancer = new ApplicationLoadBalancer(stack, this.loadBalancerId, {
      vpc: network.vpc,
      internetFacing: LoadBalancerConfig.SERVER_LOAD_BALANCER_CONFIG.internetFacing,
      vpcSubnets: LoadBalancerConfig.SERVER_LOAD_BALANCER_CONFIG.vpcSubnets
    })

    this.listenerId = `${stack.prefix}-server-alb-listener`
    this.listener = this.loadBalancer.addListener(this.listenerId, {
      port: LoadBalancerConfig.SERVER_LOAD_BALANCER_CONFIG.listenerPort,
      protocol: LoadBalancerConfig.SERVER_LOAD_BALANCER_CONFIG.listenerProtocol
      // defaultAction: LoadBalancerConfig.SERVER_LOAD_BALANCER_CONFIG.defaultAction
    })
  }
}