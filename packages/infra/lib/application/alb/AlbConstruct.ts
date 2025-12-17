import { Construct } from 'constructs'
import type { AlbConstructProps } from '../types.js'
import { type ApplicationListener, ApplicationLoadBalancer, ApplicationProtocol, ListenerAction } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Duration } from 'aws-cdk-lib'

export class AlbConstruct extends Construct {
  readonly securityGroup: SecurityGroup
  readonly securityGroupId: string

  readonly loadBalancer: ApplicationLoadBalancer
  readonly loadBalancerId: string

  readonly listener: ApplicationListener
  readonly listenerId: string

  readonly listenerPort = 80
  readonly listenerProtocol = ApplicationProtocol.HTTP

  private readonly internalConfig = {
    security: {
      allowAllOutbound: true
    },

    internetFacing: true,
    vpcSubnets: {
      subnetType: SubnetType.PUBLIC
    },

    idleTimeout: Duration.seconds(60),
    defaultAction: ListenerAction.fixedResponse(404)
  }

  constructor (props: AlbConstructProps) {
    const { scope, vpc } = props
    super(scope, `${scope.prefix}-alb`)

    this.securityGroupId = `${scope.prefix}-alb-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: this.internalConfig.security.allowAllOutbound
    })

    this.loadBalancerId = `${scope.prefix}-application-load-balancer`
    this.loadBalancer = new ApplicationLoadBalancer(this, this.loadBalancerId, {
      vpc,
      internetFacing: this.internalConfig.internetFacing,
      vpcSubnets: this.internalConfig.vpcSubnets
    })

    this.listenerId = `${scope.prefix}-alb-listener`
    this.listener = this.loadBalancer.addListener(this.listenerId, {
      protocol: this.listenerProtocol,
      port: this.listenerPort,
      defaultAction: this.internalConfig.defaultAction
    })
  }
}