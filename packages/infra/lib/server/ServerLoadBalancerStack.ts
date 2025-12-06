import { type ApplicationListener, ApplicationLoadBalancer, ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { InfraStack } from '../InfraStack.js'
import type { ServerLoadBalancerStackProps } from './types.js'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'

export class ServerLoadBalancerStack extends InfraStack {
  static readonly INTERNET_FACING = false

  static readonly LISTENER_PORT = 80
  static readonly LISTENER_PROTOCOL = ApplicationProtocol.HTTP

  readonly loadBalancerId: string
  readonly loadBalancer: ApplicationLoadBalancer

  readonly listenerId: string
  readonly listener: ApplicationListener

  constructor (props: ServerLoadBalancerStackProps) {
    const { app, network } = props
    super({ app, stackName: 'server-load-balancer' })

    this.loadBalancerId = `${this.prefix}-server-alb`
    this.loadBalancer = new ApplicationLoadBalancer(this, this.loadBalancerId, {
      loadBalancerName: this.loadBalancerId,
      vpc: network.vpc,
      internetFacing: ServerLoadBalancerStack.INTERNET_FACING,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC
      }
    })

    this.listenerId = `${this.prefix}-server-alb-listener`
    this.listener = this.loadBalancer.addListener(this.listenerId, {
      port: ServerLoadBalancerStack.LISTENER_PORT,
      protocol: ServerLoadBalancerStack.LISTENER_PROTOCOL
    })
  }
}